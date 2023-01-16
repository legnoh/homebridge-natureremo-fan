# homebridge-natureremo-fan

- homebridge NatureRemo Cloud API specialized FAN control plugin
- forked from [mizuka-ninomae/homebridge-nature-remo-cloud-fan](https://github.com/mizuka-ninomae/homebridge-nature-remo-cloud-fan)

## function

- speed
  - OFF(0%)
  - LOW(33%)
  - MIDDLE(66%)
  - HIGH(100%)
- direction
  - CLOCKWISE
  - COUNTERCLOCKWISE

## config

```json
  "accessories": [
      {
          "accessory": "NatureRemoFan",
          "name": "Fan",
          "access_token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "high_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "middle_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "low_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "off_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "clockwise_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "c_clockwise_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
      },
  ]
```
