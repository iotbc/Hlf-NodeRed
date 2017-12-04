Send file for Arduino
----------
This is a simulation system which sends collected sensor data over CAN (Controller Area Network).

> **Note:**
In order to run this code, you should have CAN-BUS shield for Arduino and USB2CAN analyzer for computer (i.e. Raspberry Pi) or another CAN-BUS shield.

You can add new sensor and gather its data while you can assign it a new ID. However you should have your own sensor function in the code if you use another sensor. In our use case, we opt to use temperature and LDR sensor.
