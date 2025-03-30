#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, String, Vec};

#[contract]
pub struct HealthCareContract;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admins,         
    Providers,
    Records,
    PendingAdmins,  
    Settings         
}

#[contracttype]
#[derive(Clone)]
pub struct AdminStatus {
    pub weight: u32, 
    pub active: bool,
}

#[contractimpl]
impl HealthCareContract {

    pub fn initialize(
        env: Env,
        initial_admins: Vec<Address>,
        required_approvals: u32
    ) -> bool {
        if env.storage().persistent().has(&DataKey::Admins) {
            panic!("Contract already initialized");
        }

        for admin in initial_admins.iter() {
            admin.require_auth();
        }

        let mut admins = Map::new(&env);
        for admin in initial_admins.iter() {
            admins.set(
                admin.clone(),
                AdminStatus {
                    weight: 1,
                    active: true,
                }
            );
        }
        
   
        let mut settings = Map::new(&env);
        settings.set(String::from_slice(&env, "required_approvals"), required_approvals);
        settings.set(String::from_slice(&env, "is_upgradable"), 1u32);
        
        env.storage().persistent().set(&DataKey::Admins, &admins);
        env.storage().persistent().set(&DataKey::Settings, &settings);
        true
    }

    pub fn propose_admin(env: Env, proposer: Address, new_admin: Address) -> bool {
        proposer.require_auth();
        Self::validate_admin(&env, &proposer);
        
        let mut pending = env.storage().persistent()
            .get::<_, Map<Address, Vec<Address>>>(&DataKey::PendingAdmins)
            .unwrap_or_else(|| Map::new(&env));

        let mut approvals = pending.get(new_admin.clone()).unwrap_or_else(|| Vec::new(&env));
        if !approvals.contains(&proposer) {
            approvals.push_back(proposer.clone());
            pending.set(new_admin.clone(), approvals.clone());
            env.storage().persistent().set(&DataKey::PendingAdmins, &pending);
        }
        
      
        if approvals.len() >= Self::get_required_approvals(&env) {
            Self::finalize_admin_add(&env, new_admin);
        }
        true
    }

    pub fn remove_admin(env: Env, remover: Address, admin_to_remove: Address) -> bool {
        remover.require_auth();
        Self::validate_admin(&env, &remover);
        
        let mut pending_removals = env.storage().persistent()
            .get::<_, Map<Address, Vec<Address>>>(&DataKey::PendingAdmins)
            .unwrap_or_else(|| Map::new(&env));

        let mut removals = pending_removals.get(admin_to_remove.clone())
            .unwrap_or_else(|| Vec::new(&env));
        
        if !removals.contains(&remover) {
            removals.push_back(remover);
            pending_removals.set(admin_to_remove.clone(), removals.clone());
            env.storage().persistent().set(&DataKey::PendingAdmins, &pending_removals);
        }

        if removals.len() >= Self::get_required_approvals(&env) {
            Self::finalize_admin_remove(&env, admin_to_remove);
        }
        true
    }

 
    pub fn register_provider(
        env: Env,
        caller: Address,
        provider_address: Address,
        provider_id: String,
        credentials: String,
    ) -> bool {
        caller.require_auth();
        Self::validate_admin(&env, &caller);  // Now uses multi-sig aware validation

        let mut providers = env.storage().persistent()
            .get::<DataKey, Map<Address, (String, String, bool)>>(&DataKey::Providers)
            .unwrap_or_else(|| Map::new(&env));

        providers.set(provider_address, (provider_id, credentials, true));
        env.storage().persistent().set(&DataKey::Providers, &providers);
        true
    }

   
    fn finalize_admin_add(env: &Env, new_admin: Address) {
        let mut admins = Self::get_admins(env);
        admins.set(
            new_admin.clone(),
            AdminStatus {
                weight: 1,
                active: true,
            }
        );
        env.storage().persistent().set(&DataKey::Admins, &admins);
    }

    fn finalize_admin_remove(env: &Env, admin_to_remove: Address) {
        let mut admins = Self::get_admins(env);
        admins.remove(admin_to_remove);
        env.storage().persistent().set(&DataKey::Admins, &admins);
    }

    fn validate_admin(env: &Env, address: &Address) {
        let admins = Self::get_admins(env);
        if !admins.contains_key(address.clone()) || !admins.get(address.clone()).unwrap().active {
            panic!("Unauthorized access");
        }
    }

    fn get_required_approvals(env: &Env) -> u32 {
        let settings = env.storage().persistent()
            .get::<DataKey, Map<String, u32>>(&DataKey::Settings)
            .unwrap();
        settings.get(String::from_slice(env, "required_approvals")).unwrap()
    }

    fn get_admins(env: &Env) -> Map<Address, AdminStatus> {
        env.storage().persistent()
            .get::<DataKey, Map<Address, AdminStatus>>(&DataKey::Admins)
            .unwrap()
    }

    
    pub fn update_provider_status(env: Env, caller: Address, provider_address: Address, active_status: bool) -> bool {
        // Require authorization from the caller
        caller.require_auth();
        
        // Ensure the caller is an authorized administrator
        if !Self::is_admin(&env, &caller) {
            panic!("Unauthorized");
        }

        let mut providers = env.storage().persistent().get::<DataKey, Map<Address, (String, String, bool)>>(&DataKey::Providers)
            .unwrap_or_else(|| Map::new(&env));

        if let Some((provider_id, credentials, _)) = providers.get(provider_address.clone()) {
            providers.set(provider_address.clone(), (provider_id, credentials, active_status));
            env.storage().persistent().set(&DataKey::Providers, &providers);
            true
        } else {
            panic!("Provider not found");
        }
    }

   
    pub fn upload_health_record(
        env: Env,
        caller: Address,
        record_id: String,
        user_address: Address,
        record_hash: String,
        record_type: String,
        timestamp: u64,
    ) -> bool {
       
        caller.require_auth();
        

        if !Self::is_active_provider(&env, &caller) {
            panic!("Unauthorized or inactive provider");
        }

        let mut records = env.storage().persistent().get::<DataKey, Map<String, (Address, String, String, u64)>>(&DataKey::Records)
            .unwrap_or_else(|| Map::new(&env));

        if records.contains_key(record_id.clone()) {
            panic!("Record already exists");
        }

        records.set(record_id, (user_address, record_hash, record_type, timestamp)
        );
        env.storage().persistent().set(&DataKey::Records, &records);
        true
    }

    
    pub fn update_health_record(
        env: Env,
        caller: Address,
        record_id: String,
        new_record_hash: String,
        new_timestamp: u64,
    ) -> bool {
       
        caller.require_auth();
        
    
        if !Self::is_active_provider(&env, &caller) {
            panic!("Unauthorized or inactive provider");
        }

        let mut records = env.storage().persistent().get::<DataKey, Map<String, (Address, String, String, u64)>>(&DataKey::Records)
            .unwrap_or_else(|| Map::new(&env));

        if let Some((user_address, _, record_type, _)) = records.get(record_id.clone()) {
            records.set(
                record_id,
                (user_address, new_record_hash, record_type, new_timestamp),
            );
            env.storage().persistent().set(&DataKey::Records, &records);
            true
        } else {
            panic!("Record not found");
        }
    }

 
    pub fn verify_health_record(env: Env, record_id: String, provided_hash: String) -> bool {
        let records = env.storage().persistent().get::<DataKey, Map<String, (Address, String, String, u64)>>(&DataKey::Records)
            .unwrap_or_else(|| Map::new(&env));

        if let Some((_, record_hash, _, _)) = records.get(record_id) {
            record_hash == provided_hash
        } else {
            false
        }
    }

   
    pub fn get_record_details(
        env: Env,
        record_id: String,
    ) -> (Address, String, String, u64) {
        let records = env.storage().persistent().get::<DataKey, Map<String, (Address, String, String, u64)>>(&DataKey::Records)
            .unwrap_or_else(|| Map::new(&env));

        records.get(record_id).expect("Record not found")
    }

    
    fn is_admin(env: &Env, address: &Address) -> bool {
        let admins = env.storage().persistent().get::<DataKey, Vec<Address>>(&DataKey::Admins)
            .unwrap_or_else(|| Vec::new(env));
        admins.contains(address)
    }

  
    fn is_active_provider(env: &Env, address: &Address) -> bool {
        let providers = env.storage().persistent().get::<DataKey, Map<Address, (String, String, bool)>>(&DataKey::Providers)
            .unwrap_or_else(|| Map::new(env));
        if let Some((_, _, active)) = providers.get(address.clone()) {
            active
        } else {
            false
        }
    }
}