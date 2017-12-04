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

/**
 * Sample transaction processor function.
 * @param {org.acme.testnetwork.UpdateSensorData} tx The sample transaction instance.
 * @transaction
 */
function UpdateSensorData(tx) {

    // Save the old value of the asset.
    var oldTempVal = tx.sampDevice.tempVal;
    var oldLightVal = tx.sampDevice.lightVal;
    
    // Update the asset with the new value.
    tx.sampDevice.tempVal = tx.newTempVal;
    tx.sampDevice.lightVal = tx.newLightVal;
    

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.testnetwork.SampleDevice')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(tx.sampDevice);

        })
        .then(function () {

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.testnetwork', 'SampleEvent');
            event.sampDevice = tx.sampDevice;
            event.oldTempVal = oldTempVal;
            event.newTempVal = tx.newTempVal;
            event.oldLightVal = oldLightVal;
            event.newLightVal = tx.newLightVal;
            emit(event);

        });

}
