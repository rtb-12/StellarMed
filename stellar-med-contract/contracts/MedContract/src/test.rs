#![cfg(test)]
use crate::*;
use soroban_sdk::{testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation}, vec, Env, IntoVal};

#[test]
fn test_contract_initialization() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HealthCareContract);
    let client = HealthCareContractClient::new(&env, &contract_id);

    // Create a test admin
    let admin = Address::generate(&env);
    
    // Initialize the contract with the admin
    let result = client.initialize(&admin);
    assert!(result);
    
    // Attempt to initialize again - should panic
    let admin2 = Address::generate(&env);
    let result = std::panic::catch_unwind(|| {
        client.initialize(&admin2);
    });
    assert!(result.is_err());
}

#[test]
fn test_admin_management() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HealthCareContract);
    let client = HealthCareContractClient::new(&env, &contract_id);

    // Create test admins
    let admin1 = Address::generate(&env);
    let admin2 = Address::generate(&env);
    let normal_user = Address::generate(&env);
    
    // Initialize the contract with admin1
    client.initialize(&admin1);
    
    // Admin1 adds admin2 as an admin
    env.mock_all_auths();
    let result = client.add_admin(&admin1, &admin2);
    assert!(result);
    
    // Try to add admin2 again (should return false, not panic)
    env.mock_all_auths();
    let result = client.add_admin(&admin1, &admin2);
    assert!(!result);
    
    // Normal user tries to add someone as admin (should panic)
    env.mock_all_auths();
    let result = std::panic::catch_unwind(|| {
        client.add_admin(&normal_user, &Address::generate(&env));
    });
    assert!(result.is_err());
    
    // Verify that admin2 can also add new admins
    env.mock_all_auths();
    let admin3 = Address::generate(&env);
    let result = client.add_admin(&admin2, &admin3);
    assert!(result);
}

#[test]
fn test_provider_registration() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HealthCareContract);
    let client = HealthCareContractClient::new(&env, &contract_id);

    // Create test users
    let admin = Address::generate(&env);
    let provider = Address::generate(&env);
    let normal_user = Address::generate(&env);
    
    // Initialize the contract with admin
    client.initialize(&admin);
    
    // Admin registers a provider
    env.mock_all_auths();
    let provider_id = String::from_str(&env, "DR123");
    let credentials = String::from_str(&env, "Board Certified");
    let result = client.register_provider(&admin, &provider, &provider_id, &credentials);
    assert!(result);
    
    // Try to register the same provider again (should panic)
    env.mock_all_auths();
    let result = std::panic::catch_unwind(|| {
        client.register_provider(
            &admin, 
            &provider, 
            &String::from_str(&env, "DR123_new"), 
            &String::from_str(&env, "New Credentials")
        );
    });
    assert!(result.is_err());
    
    // Normal user tries to register a provider (should panic)
    env.mock_all_auths();
    let result = std::panic::catch_unwind(|| {
        client.register_provider(
            &normal_user,
            &Address::generate(&env),
            &String::from_str(&env, "DR456"),
            &String::from_str(&env, "Some Credentials")
        );
    });
    assert!(result.is_err());
}

#[test]
fn test_provider_status_update() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HealthCareContract);
    let client = HealthCareContractClient::new(&env, &contract_id);

    // Create test users
    let admin = Address::generate(&env);
    let provider = Address::generate(&env);
    
    // Initialize the contract with admin
    client.initialize(&admin);
    
    // Admin registers a provider (active by default)
    env.mock_all_auths();
    let provider_id = String::from_str(&env, "DR123");
    let credentials = String::from_str(&env, "Board Certified");
    client.register_provider(&admin, &provider, &provider_id, &credentials);
    
    // Admin deactivates the provider
    env.mock_all_auths();
    let result = client.update_provider_status(&admin, &provider, false);
    assert!(result);
    
    // Provider should no longer be able to upload records (will be tested in health record tests)
    
    // Try to update status of non-existent provider (should panic)
    env.mock_all_auths();
    let result = std::panic::catch_unwind(|| {
        client.update_provider_status(&admin, &Address::generate(&env), false);
    });
    assert!(result.is_err());
}

#[test]
fn test_health_record_management() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HealthCareContract);
    let client = HealthCareContractClient::new(&env, &contract_id);

    // Create test users
    let admin = Address::generate(&env);
    let provider = Address::generate(&env);
    let patient = Address::generate(&env);
    let inactive_provider = Address::generate(&env);
    
    // Initialize the contract with admin
    client.initialize(&admin);
    
    // Admin registers providers
    env.mock_all_auths();
    client.register_provider(
        &admin, 
        &provider, 
        &String::from_str(&env, "DR123"), 
        &String::from_str(&env, "Active Doctor")
    );
    
    env.mock_all_auths();
    client.register_provider(
        &admin, 
        &inactive_provider, 
        &String::from_str(&env, "DR456"), 
        &String::from_str(&env, "Inactive Doctor")
    );
    
    // Deactivate the inactive_provider
    env.mock_all_auths();
    client.update_provider_status(&admin, &inactive_provider, false);
    
    // Active provider uploads a health record
    env.mock_all_auths();
    let record_id = String::from_str(&env, "REC001");
    let record_hash = String::from_str(&env, "hash123");
    let record_type = String::from_str(&env, "Blood Test");
    let timestamp = 1234567890u64;
    
    let result = client.upload_health_record(
        &provider, 
        &record_id,
        &patient, 
        &record_hash, 
        &record_type,
        timestamp
    );
    assert!(result);
    
    // Inactive provider tries to upload a record (should panic)
    env.mock_all_auths();
    let result = std::panic::catch_unwind(|| {
        client.upload_health_record(
            &inactive_provider, 
            &String::from_str(&env, "REC002"),
            &patient, 
            &String::from_str(&env, "hash456"), 
            &String::from_str(&env, "X-Ray"),
            1234567891u64
        );
    });
    assert!(result.is_err());
    
    // Try to upload a record with existing ID (should panic)
    env.mock_all_auths();
    let result = std::panic::catch_unwind(|| {
        client.upload_health_record(
            &provider, 
            &record_id, // Same ID as before
            &patient, 
            &String::from_str(&env, "hash789"), 
            &String::from_str(&env, "MRI"),
            1234567892u64
        );
    });
    assert!(result.is_err());
    
    // Active provider updates an existing record
    env.mock_all_auths();
    let new_hash = String::from_str(&env, "updated_hash");
    let new_timestamp = 1234567900u64;
    let result = client.update_health_record(&provider, &record_id, &new_hash, new_timestamp);
    assert!(result);
    
    // Verify record hash
    let result = client.verify_health_record(&record_id, &new_hash);
    assert!(result);
    
    // Verify with incorrect hash
    let result = client.verify_health_record(&record_id, &String::from_str(&env, "wrong_hash"));
    assert!(!result);
    
    // Get record details
    let (record_patient, hash, rec_type, ts) = client.get_record_details(&record_id);
    assert_eq!(record_patient, patient);
    assert_eq!(hash, new_hash);
    assert_eq!(rec_type, record_type);
    assert_eq!(ts, new_timestamp);
    
    // Try to get non-existent record details (should panic)
    let result = std::panic::catch_unwind(|| {
        client.get_record_details(&String::from_str(&env, "NON_EXISTENT"));
    });
    assert!(result.is_err());
}

#[test]
fn test_authorization() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HealthCareContract);
    let client = HealthCareContractClient::new(&env, &contract_id);

    // Create test users
    let admin = Address::generate(&env);
    let new_admin = Address::generate(&env);
    
    // Initialize the contract
    client.initialize(&admin);
    
    // Test that add_admin requires authorization
    let add_admin_fn = AuthorizedFunction {
        contract_id: contract_id.clone(),
        function_name: Symbol::new(&env, "add_admin"),
        args: vec![&env, admin.to_val(), new_admin.to_val()],
    };
    
    let add_admin_auth = AuthorizedInvocation {
        function: add_admin_fn,
        sub_invocations: vec![&env],
    };
    
    // This should authorize only the specific call we want
    env.mock_auth_for_innvocation(add_admin_auth);
    
    let result = client.add_admin(&admin, &new_admin);
    assert!(result);
}