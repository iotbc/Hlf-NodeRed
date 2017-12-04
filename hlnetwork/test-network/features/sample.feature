#
# Licensed under the Apache License, Version 2   (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2  
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
Feature: Sample
    Background:
        Given I have deployed the business network definition ..
        And I have added the following participants of type org.acme.testnetwork.DeviceOwner
            | tradeId         | firstName | lastName |
            | alice@email.com | Alice     | A        |
            | bob@email.com   | Bob       | B        |
        And I have added the following assets of type org.acme.testnetwork.SampleDevice
            | tradingSymbol | tempVal | lightVal | owner           |
            | 1             | 15         | 25       | alice@email.com |
        And I have issued the participant org.acme.testnetwork.DeviceOwner#alice@email.com with the identity alice1
        And I have issued the participant org.acme.testnetwork.DeviceOwner#bob@email.com with the identity bob1
