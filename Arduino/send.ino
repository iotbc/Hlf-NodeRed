#include <mcp_can_dfs.h>
#include <mcp_can.h>
#include <SPI.h>
#include <math.h>

// the cs pin of the version after v1.1 is default to D9
// v0.9b and v1.0 is default D10
const int SPI_CS_PIN = 9; 

int tempVal, ldrVal;
int ldrPin = 0;
int tempPin = 1;

MCP_CAN CAN(SPI_CS_PIN);                                    // Set CS pin

/*
 * Sets the CAN BUS shield up
 */
void setup()
{
    Serial.begin(57600);

    while (CAN_OK != CAN.begin(CAN_500KBPS))              // init can bus : baudrate = 500k
    {
        Serial.println("CAN BUS Shield init fail");
        Serial.println(" Init CAN BUS Shield again");
        delay(500);
    }
    Serial.println("CAN BUS Shield init ok!");
  
}

/*
 * Send collected data within 5 seconds interval
 */
void loop()
{
    temperature();
    ldr();
    delay(5000);
}

/*
 * Gets temperature value and converts it into Celcius degree 
 * Sends the sensor data over CAN bus
*/
void temperature() 
{  
    tempVal = analogRead(tempPin);
    float mv = ( tempVal/1024.0)*5000; 
    float cel = mv/10;
    float farh = (cel*9)/5 + 32;

    unsigned long celToInt=(int)(cel*100);
    unsigned char bytes[4];
    
    bytes[0] = (celToInt >> 24) & 0xFF;
    bytes[1] = (celToInt >> 16) & 0xFF;
    bytes[2] = (celToInt >> 8) & 0xFF;
    bytes[3] = celToInt & 0xFF;

    CAN.sendMsgBuf(0x00, 0, 4, bytes);
    
    Serial.print("TEMPERATURE = ");
    Serial.print(cel);
    Serial.print("*C");
    Serial.println();
}

/*
 * Gets analod LDR value
 * Sends the sensor data over CAN bus
 */
void ldr()
{
    ldrVal = analogRead(ldrPin);

    unsigned long ldrToInt=(int)(ldrVal);
    unsigned char bytes[4];
    
    bytes[0] = (ldrToInt >> 24) & 0xFF;
    bytes[1] = (ldrToInt >> 16) & 0xFF;
    bytes[2] = (ldrToInt >> 8) & 0xFF;
    bytes[3] = ldrToInt & 0xFF;

    CAN.sendMsgBuf(0x01, 0, 4, bytes);
    
    Serial.print("LDR = ");
    Serial.print(ldrVal);
    Serial.println();
}

// END FILE
