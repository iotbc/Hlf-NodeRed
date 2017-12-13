NodeRED Flow
----------
This flow receives data over CAN and transmits this data to Hyperledger Fabric infrastructure. It collects data within every 15 seconds and sends them together.

> **Note:**
> 
> - In order to run this code, you should have USB2CAN analyzer.
> - Before running this code you should set the CAN system and USB2CAN analyzer up:
> > - Set can0 interface speed to 500 Kbps:
> >
> > ```sudo ip link set can0 up type can bitrate 500000 sample-point 0.875 ```
> > - Set to can0 to “steady” state (steady green led):
> >
> > ```sudo ip link set can0 up``` 
> > - Test and receive everything on can0 interface:
> >
> > ```candump can0```
> 
> - Also you need to compile and run your own Hyperledger Fabric network. You should update the device name in the `function` node named "DataCollector".
> - You may need to change IP address value of `url` variable in `http request` node.

This flow can be used to collect any sensor value. `CANOutput` node gets raw data of the output obtained from CAN analyzer and converts this raw output to ID of the sensor and measured value. These values are added to the `payload` of the correspoinding `msg`.
