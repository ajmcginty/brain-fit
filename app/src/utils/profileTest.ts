import { createProfile, getProfile, validateProfileIntegrity, restructureExistingData } from '../services/profileService';
import { createDataMigrationService } from '../services/dataMigrationService';
import { checkProfileHealth, generateHealthReport } from './profileHealth';

/**
 * Test utility for the profile system
 */
export async function testProfileSystem(): Promise<string> {
  const results: string[] = [];
  
  try {
    results.push('=== Profile System Test ===\n');
    
    // Test 1: Profile Creation
    results.push('1. Testing Profile Creation...');
    const profile = await createProfile();
    results.push(`✅ Profile created successfully`);
    results.push(`   Device ID: ${profile.deviceId}`);
    results.push(`   Created: ${profile.createdAt}`);
    results.push(`   Last Active: ${profile.lastActive}\n`);
    
    // Test 2: Profile Retrieval
    results.push('2. Testing Profile Retrieval...');
    const retrievedProfile = await getProfile();
    if (retrievedProfile && retrievedProfile.deviceId === profile.deviceId) {
      results.push('✅ Profile retrieved successfully');
    } else {
      results.push('❌ Profile retrieval failed');
    }
    results.push('');
    
    // Test 3: Profile Validation
    results.push('3. Testing Profile Validation...');
    const isValid = await validateProfileIntegrity(profile);
    if (isValid) {
      results.push('✅ Profile validation passed');
    } else {
      results.push('❌ Profile validation failed');
    }
    results.push('');
    
    // Test 4: Data Migration Service
    results.push('4. Testing Data Migration Service...');
    const migrationService = createDataMigrationService(profile.deviceId);
    const migrationStatus = await migrationService.getMigrationStatus();
    results.push(`✅ Migration service created`);
    results.push(`   Is Migrated: ${migrationStatus.isMigrated}`);
    results.push(`   Has Legacy Data: ${migrationStatus.hasLegacyData}`);
    results.push(`   Migrated Data Count: ${migrationStatus.migratedDataCount}\n`);
    
    // Test 5: Profile Health Check
    results.push('5. Testing Profile Health Check...');
    const healthStatus = await checkProfileHealth();
    const healthReport = generateHealthReport(healthStatus);
    results.push(healthReport);
    results.push('');
    
    // Test 6: Data Restructuring
    results.push('6. Testing Data Restructuring...');
    try {
      await restructureExistingData(profile.deviceId);
      results.push('✅ Data restructuring completed');
    } catch (error) {
      results.push(`⚠️ Data restructuring: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    results.push('');
    
    results.push('=== Test Summary ===');
    results.push(`Profile System: ${healthStatus.isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    results.push(`Profile Exists: ${healthStatus.profileExists ? '✅ Yes' : '❌ No'}`);
    results.push(`Profile Valid: ${healthStatus.profileValid ? '✅ Yes' : '❌ No'}`);
    results.push(`Storage Initialized: ${healthStatus.storageInitialized ? '✅ Yes' : '❌ No'}`);
    results.push(`Data Accessible: ${healthStatus.dataAccessible ? '✅ Yes' : '❌ No'}`);
    
    return results.join('\n');
  } catch (error) {
    results.push(`❌ Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return results.join('\n');
  }
}

/**
 * Quick health check for development
 */
export async function quickHealthCheck(): Promise<string> {
  try {
    const healthStatus = await checkProfileHealth();
    return generateHealthReport(healthStatus);
  } catch (error) {
    return `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
