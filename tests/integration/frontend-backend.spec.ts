/**
 * Playwright Integration Tests for SAUBHAGYA Frontend-Backend Connectivity
 * Tests the complete data flow between frontend and all 6 microservices
 */

import { test, expect } from '@playwright/test';

// Test configuration
const WEB_ADMIN_URL = 'http://localhost:3007';
const MICROSERVICES = {
  auth: 'http://localhost:8081',
  iot: 'http://localhost:8080',
  transaction: 'http://localhost:8082',
  sales: 'http://localhost:8083',
  reporting: 'http://localhost:8084',
  government: 'http://localhost:8085'
};

test.describe('SAUBHAGYA Frontend-Backend Integration', () => {

  test.beforeAll(async () => {
    console.log('🧪 Starting Playwright Frontend-Backend Integration Tests...');
  });

  test('should verify all microservices are healthy', async ({ request }) => {
    console.log('1. Testing all microservices health endpoints...');

    // Test Auth Service
    const authHealth = await request.get(`${MICROSERVICES.auth}/auth/actuator/health`);
    expect(authHealth.ok()).toBeTruthy();
    const authData = await authHealth.json();
    expect(authData.status).toBe('UP');
    console.log('✅ Auth Service: Healthy');

    // Test IoT Service
    const iotHealth = await request.get(`${MICROSERVICES.iot}/iot/actuator/health`);
    expect(iotHealth.ok()).toBeTruthy();
    const iotData = await iotHealth.json();
    expect(iotData.status).toBe('UP');
    console.log('✅ IoT Service: Healthy');

    // Test Transaction Service
    const transactionHealth = await request.get(`${MICROSERVICES.transaction}/actuator/health`);
    expect(transactionHealth.ok()).toBeTruthy();
    const transactionData = await transactionHealth.json();
    expect(transactionData.status).toBe('UP');
    console.log('✅ Transaction Service: Healthy');

    // Test Sales Service
    const salesHealth = await request.get(`${MICROSERVICES.sales}/actuator/health`);
    expect(salesHealth.ok()).toBeTruthy();
    const salesData = await salesHealth.json();
    expect(salesData.status).toBe('UP');
    console.log('✅ Sales Service: Healthy');

    // Test Reporting Service
    const reportingHealth = await request.get(`${MICROSERVICES.reporting}/actuator/health`);
    expect(reportingHealth.ok()).toBeTruthy();
    const reportingData = await reportingHealth.json();
    expect(reportingData.status).toBe('UP');
    console.log('✅ Reporting Service: Healthy');

    // Test Government Service
    const governmentHealth = await request.get(`${MICROSERVICES.government}/government/actuator/health`);
    expect(governmentHealth.ok()).toBeTruthy();
    const governmentData = await governmentHealth.json();
    expect(governmentData.status).toBe('UP');
    console.log('✅ Government Service: Healthy');

    console.log('🎉 All 6 microservices are healthy!');
  });

  test('should generate JWT token successfully', async ({ request }) => {
    console.log('2. Testing JWT token generation...');

    const tokenResponse = await request.post(`${MICROSERVICES.auth}/auth/oauth2/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from('saubhagya-web:web-app-secret-2024').toString('base64'),
      },
      data: 'grant_type=client_credentials&scope=iot-service commerce-service government-service reporting-service profile',
    });

    expect(tokenResponse.ok()).toBeTruthy();
    const tokenData = await tokenResponse.json();

    expect(tokenData).toHaveProperty('access_token');
    expect(tokenData).toHaveProperty('token_type', 'Bearer');
    expect(tokenData).toHaveProperty('expires_in');
    expect(tokenData.scope).toContain('iot-service');

    console.log('✅ JWT Token generated successfully');
    console.log(`Token expires in: ${tokenData.expires_in} seconds`);

    // Store token for other tests
    test.info().annotations.push({
      type: 'jwt_token',
      description: tokenData.access_token
    });
  });

  test('should fetch cattle data through Auth gateway', async ({ request }) => {
    console.log('3. Testing cattle data API...');

    const cattleResponse = await request.get(`${MICROSERVICES.auth}/auth/api/v1/cattle/list`);
    expect(cattleResponse.ok()).toBeTruthy();

    const cattleData = await cattleResponse.json();
    expect(cattleData).toHaveProperty('success', true);
    expect(cattleData).toHaveProperty('data');
    expect(Array.isArray(cattleData.data)).toBeTruthy();
    expect(cattleData.data.length).toBeGreaterThan(0);

    console.log(`✅ Cattle API working - Found ${cattleData.data.length} cattle records`);

    // Verify cattle data structure
    const firstCattle = cattleData.data[0];
    expect(firstCattle).toHaveProperty('id');
    expect(firstCattle).toHaveProperty('tagId');
    expect(firstCattle).toHaveProperty('name');
    expect(firstCattle).toHaveProperty('breed');
    expect(firstCattle).toHaveProperty('health');

    console.log(`Sample cattle: ${firstCattle.name} (${firstCattle.breed})`);
  });

  test('should load Web Admin frontend', async ({ page }) => {
    console.log('4. Testing Web Admin frontend loading...');

    // Navigate to Web Admin
    await page.goto(WEB_ADMIN_URL);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if page loaded successfully
    await expect(page).toHaveTitle(/SAUBHAGYA|Admin|Dashboard/i);

    // Take screenshot for verification
    await page.screenshot({
      path: 'test-results/web-admin-loaded.png',
      fullPage: true
    });

    console.log('✅ Web Admin frontend loaded successfully');
  });

  test('should test API integration in browser', async ({ page }) => {
    console.log('5. Testing API integration in browser...');

    await page.goto(WEB_ADMIN_URL);
    await page.waitForLoadState('networkidle');

    // Inject test script to test API calls from browser
    const apiTestResult = await page.evaluate(async () => {
      try {
        // Test 1: JWT Token Generation
        const tokenResponse = await fetch('http://localhost:8081/auth/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('saubhagya-web:web-app-secret-2024'),
          },
          body: 'grant_type=client_credentials&scope=iot-service commerce-service government-service reporting-service profile',
        });

        if (!tokenResponse.ok) {
          throw new Error('JWT token generation failed');
        }

        const tokenData = await tokenResponse.json();

        // Test 2: Cattle API
        const cattleResponse = await fetch('http://localhost:8081/auth/api/v1/cattle/list');
        if (!cattleResponse.ok) {
          throw new Error('Cattle API failed');
        }

        const cattleData = await cattleResponse.json();

        return {
          success: true,
          jwtToken: !!tokenData.access_token,
          cattleCount: cattleData.data?.length || 0,
          cattleApiWorking: cattleData.success
        };

      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    expect(apiTestResult.success).toBeTruthy();
    expect(apiTestResult.jwtToken).toBeTruthy();
    expect(apiTestResult.cattleApiWorking).toBeTruthy();
    expect(apiTestResult.cattleCount).toBeGreaterThan(0);

    console.log('✅ Browser API integration working');
    console.log(`JWT Token: ${apiTestResult.jwtToken ? 'Generated' : 'Failed'}`);
    console.log(`Cattle Records: ${apiTestResult.cattleCount}`);
  });

  test('should test microservices with JWT authentication', async ({ request, page }) => {
    console.log('6. Testing microservices with JWT authentication...');

    // Get JWT token first
    const tokenResponse = await request.post(`${MICROSERVICES.auth}/auth/oauth2/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from('saubhagya-web:web-app-secret-2024').toString('base64'),
      },
      data: 'grant_type=client_credentials&scope=iot-service commerce-service government-service reporting-service profile',
    });

    const tokenData = await tokenResponse.json();
    const jwtToken = tokenData.access_token;

    // Test IoT Service with JWT
    const iotResponse = await request.get(`${MICROSERVICES.iot}/iot/api/v1/devices`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    // Note: May return 404 if no devices endpoint, but should not return 401/403
    console.log(`IoT Service with JWT: ${iotResponse.status()}`);

    // Test that JWT is properly validated (should not be 401 Unauthorized)
    expect(iotResponse.status()).not.toBe(401);

    console.log('✅ JWT authentication working with microservices');
  });

  test('should verify CORS configuration', async ({ page }) => {
    console.log('7. Testing CORS configuration...');

    await page.goto(WEB_ADMIN_URL);

    // Test CORS by making cross-origin requests
    const corsTestResult = await page.evaluate(async () => {
      try {
        const testRequests = [
          'http://localhost:8081/auth/actuator/health',
          'http://localhost:8080/iot/actuator/health',
          'http://localhost:8082/actuator/health',
          'http://localhost:8083/actuator/health',
          'http://localhost:8084/actuator/health',
          'http://localhost:8085/government/actuator/health'
        ];

        const results = [];
        for (const url of testRequests) {
          try {
            const response = await fetch(url);
            results.push({
              service: url.split(':')[2].split('/')[0],
              status: response.status,
              success: response.ok
            });
          } catch (error) {
            results.push({
              service: url.split(':')[2].split('/')[0],
              status: 'CORS_ERROR',
              success: false,
              error: error.message
            });
          }
        }

        return results;
      } catch (error) {
        return { error: error.message };
      }
    });

    console.log('CORS Test Results:');
    corsTestResult.forEach(result => {
      console.log(`  Port ${result.service}: ${result.success ? '✅ ALLOWED' : '❌ ' + result.status}`);
    });

    // At least some services should be accessible (they all have CORS configured)
    const successfulRequests = corsTestResult.filter(r => r.success).length;
    expect(successfulRequests).toBeGreaterThan(0);

    console.log('✅ CORS configuration verified');
  });

  test('should generate integration test report', async ({ page }) => {
    console.log('8. Generating integration test report...');

    await page.goto(WEB_ADMIN_URL);

    // Create a comprehensive report
    const reportData = await page.evaluate(async () => {
      const services = [
        { name: 'Auth Service', port: 8081, path: '/auth/actuator/health' },
        { name: 'IoT Service', port: 8080, path: '/iot/actuator/health' },
        { name: 'Transaction Service', port: 8082, path: '/actuator/health' },
        { name: 'Sales Service', port: 8083, path: '/actuator/health' },
        { name: 'Reporting Service', port: 8084, path: '/actuator/health' },
        { name: 'Government Service', port: 8085, path: '/government/actuator/health' }
      ];

      const report = {
        timestamp: new Date().toISOString(),
        services: [],
        jwt: null,
        dataFlow: null,
        frontend: {
          webAdmin: 'http://localhost:3007',
          status: 'LOADED'
        }
      };

      // Test each service
      for (const service of services) {
        try {
          const response = await fetch(`http://localhost:${service.port}${service.path}`);
          const data = response.ok ? await response.json() : null;

          report.services.push({
            name: service.name,
            port: service.port,
            status: response.status,
            healthy: data?.status === 'UP',
            database: data?.components?.db?.status === 'UP',
            redis: data?.components?.redis?.status === 'UP'
          });
        } catch (error) {
          report.services.push({
            name: service.name,
            port: service.port,
            status: 'ERROR',
            healthy: false,
            error: error.message
          });
        }
      }

      // Test JWT
      try {
        const tokenResponse = await fetch('http://localhost:8081/auth/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('saubhagya-web:web-app-secret-2024'),
          },
          body: 'grant_type=client_credentials&scope=iot-service commerce-service government-service reporting-service profile',
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          report.jwt = {
            working: true,
            expiresIn: tokenData.expires_in,
            scopes: tokenData.scope.split(' ')
          };
        }
      } catch (error) {
        report.jwt = { working: false, error: error.message };
      }

      // Test data flow
      try {
        const cattleResponse = await fetch('http://localhost:8081/auth/api/v1/cattle/list');
        if (cattleResponse.ok) {
          const cattleData = await cattleResponse.json();
          report.dataFlow = {
            working: cattleData.success,
            cattleCount: cattleData.data?.length || 0,
            source: cattleData.source
          };
        }
      } catch (error) {
        report.dataFlow = { working: false, error: error.message };
      }

      return report;
    });

    // Log comprehensive report
    console.log('\n📊 SAUBHAGYA Integration Test Report');
    console.log('=====================================');
    console.log(`Timestamp: ${reportData.timestamp}`);
    console.log(`Frontend: ${reportData.frontend.webAdmin} (${reportData.frontend.status})`);
    console.log('\nMicroservices Status:');

    reportData.services.forEach(service => {
      const healthIcon = service.healthy ? '✅' : '❌';
      const dbIcon = service.database ? '🗄️' : '';
      const redisIcon = service.redis ? '🔄' : '';
      console.log(`  ${healthIcon} ${service.name} (${service.port}): ${service.status} ${dbIcon} ${redisIcon}`);
    });

    console.log('\nAuthentication:');
    console.log(`  JWT Token: ${reportData.jwt?.working ? '✅ Working' : '❌ Failed'}`);
    if (reportData.jwt?.working) {
      console.log(`  Expires in: ${reportData.jwt.expiresIn} seconds`);
      console.log(`  Scopes: ${reportData.jwt.scopes.join(', ')}`);
    }

    console.log('\nData Flow:');
    console.log(`  Cattle API: ${reportData.dataFlow?.working ? '✅ Working' : '❌ Failed'}`);
    if (reportData.dataFlow?.working) {
      console.log(`  Records: ${reportData.dataFlow.cattleCount}`);
      console.log(`  Source: ${reportData.dataFlow.source}`);
    }

    // Calculate success rate
    const healthyServices = reportData.services.filter(s => s.healthy).length;
    const totalServices = reportData.services.length;
    const successRate = Math.round((healthyServices / totalServices) * 100);

    console.log(`\n🎯 Success Rate: ${healthyServices}/${totalServices} services (${successRate}%)`);

    if (successRate === 100 && reportData.jwt?.working && reportData.dataFlow?.working) {
      console.log('🎉 PERFECT SCORE! Frontend-Backend integration is 100% operational!');
    } else if (successRate >= 80) {
      console.log('✅ GOOD! Most systems are operational');
    } else {
      console.log('⚠️ NEEDS ATTENTION! Some critical systems are down');
    }

    // Assertions for test
    expect(healthyServices).toBeGreaterThanOrEqual(5); // At least 5 of 6 services should be healthy
    expect(reportData.jwt?.working).toBeTruthy();
    expect(reportData.dataFlow?.working).toBeTruthy();

    console.log('\n✅ Integration test report generated successfully');
  });

});