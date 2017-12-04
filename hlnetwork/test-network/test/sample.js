/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BrowserFS = require('browserfs/dist/node/index');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const path = require('path');

require('chai').should();

const bfs_fs = BrowserFS.BFSRequire('fs');
const NS = 'org.acme.testnetwork';

describe('Update Monitoring Values', () => {

    // let adminConnection;
    let businessNetworkConnection;

    before(() => {
        BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
        const adminConnection = new AdminConnection({ fs: bfs_fs });
        return adminConnection.createProfile('defaultProfile', {
            type: 'embedded'
        })
            .then(() => {
                return adminConnection.connect('defaultProfile', 'admin', 'adminpw');
            })
            .then(() => {
                return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
            })
            .then((businessNetworkDefinition) => {
                return adminConnection.deploy(businessNetworkDefinition);
            })
            .then(() => {
                businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
                return businessNetworkConnection.connect('defaultProfile', 'test-network', 'admin', 'adminpw');
            });
    });

    describe('#updateDeviceData', () => {

        it('should be able to update a SampleDevice', () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            // create the DeviceOwners
            const dan = factory.newResource(NS, 'DeviceOwner', 'dan@email.com');
            dan.firstName = 'Dan';
            dan.lastName = 'Selman';

            const simon = factory.newResource(NS, 'DeviceOwner', 'simon@email.com');
            simon.firstName = 'Simon';
            simon.lastName = 'Stone';

            // create the SampleDevice
            const sampleDevice = factory.newResource(NS, 'SampleDevice', 'EMA');
            sampleDevice.tempVal = 20.0;
            sampleDevice.lightVal = 10.0;
            sampleDevice.owner = factory.newRelationship(NS, 'DeviceOwner', dan.$identifier);

            // create the updateSensorData transaction
            const updateSensorData = factory.newTransaction(NS, 'UpdateSensorData');
            updateSensorData.newTempVal = 25.00;
            updateSensorData.newLightVal = 15.00;
            updateSensorData.sampDevice = factory.newRelationship(NS, 'SampleDevice', sampleDevice.$identifier);
            // the data should not be updated
            sampleDevice.tempVal.should.equal(20.00);
            sampleDevice.lightVal.should.equal(10.00);

            // Get the asset registry.
            let SampleDeviceRegistry;
            return businessNetworkConnection.getAssetRegistry(NS + '.SampleDevice')
                .then((assetRegistry) => {
                    SampleDeviceRegistry = assetRegistry;
                    // add the SampleDevice to the asset registry.
                    return SampleDeviceRegistry.add(sampleDevice);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.DeviceOwner');
                })
                .then((participantRegistry) => {
                    // add the DeviceOwners
                    return participantRegistry.addAll([dan, simon]);
                })
                .then(() => {
                    // submit the transaction
                    return businessNetworkConnection.submitTransaction(updateSensorData);
                })
                .then(() => {
                    // re-get the SampleDe-vice
                    return SampleDeviceRegistry.get(sampleDevice.$identifier);
                })
                .then((newSampleDevice) => {
                    // the data now should be updated
                    newSampleDevice.tempVal.should.equal(25.00);
                    newSampleDevice.lightVal.should.equal(15.00);
                });
        });
    });
});
