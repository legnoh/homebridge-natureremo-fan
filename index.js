let Service, Characteristic
const exec = require('child_process').exec

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-natureremo-fan', 'NatureRemoFan', FanAccessory)
}

function FanAccessory (log, config) {
  this.log = log
  this.name = config.name
  this.access_token = config.access_token
  this.high_signal_ID = config.high_signal_ID
  this.middle_signal_ID = config.middle_signal_ID
  this.low_signal_ID = config.low_signal_ID
  this.off_signal_ID = config.off_signal_ID
  this.Use_Counter_Clockwise = config.Use_Counter_Clockwise || false
  this.clockwise_signal_ID = config.clockwise_signal_ID
  this.c_clockwise_signal_ID = config.c_clockwise_signal_ID
  this.state = {
    power: false,
    speed: 0
  }

  this.informationService = new Service.AccessoryInformation()
  this.fanService = new Service.Fan(this.name)

  this.informationService
    .setCharacteristic(Characteristic.Manufacturer, 'NatureRemo-FAN Manufacturer')
    .setCharacteristic(Characteristic.Model, 'NatureRemo-FAN Model')
    .setCharacteristic(Characteristic.SerialNumber, 'NatureRemo-FAN Serial Number')

  this.fanService
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOn.bind(this))

  this.fanService
    .getCharacteristic(Characteristic.RotationSpeed)
    .setProps({
      minValue: 0,
      maxValue: 99,
      minStep: 33
    })
    .on('set', this.setSpeed.bind(this))

  this.fanService
    .getCharacteristic(Characteristic.RotationDirection)
    .on('set', this.setDirection.bind(this))
}

// ------------------------------------------------------------------------------
FanAccessory.prototype.getServices = function () {
  return [this.informationService, this.fanService]
}

// ------------------------------------------------------------------------------
FanAccessory.prototype.setOn = function (value, callback) {
  if (this.state.power !== value) {
    this.log(' <<<< [Power Button: ' + value + ']')
    this.state.power = value
    this.setFanState(this.state, callback)
  } else {
    callback(null)
  }
}
// ------------------------------------------------------------------------------
FanAccessory.prototype.setSpeed = function (value, callback) {
  if (this.state.speed !== value) {
    if (value === 0) {
      this.state.power = false
    } else {
      this.state.power = true
    }
    this.state.speed = value
    this.setFanState(this.state, callback)
  } else {
    callback(null)
  }
}

// ------------------------------------------------------------------------------
FanAccessory.prototype.setDirection = function (value, callback) {
  if (this.state.direction !== value) {
    this.state.direction = value
    this.setFanState2(this.state, callback)
  } else {
    callback(null)
  }
}
// ------------------------------------------------------------------------------
FanAccessory.prototype.setFanState = function (state, callback) {
  let signalId
  this.log('[Power: ' + state.power + ']')
  if (state.power) {
    this.log('[FANSpeed: ' + state.speed + '%]')
    switch (state.speed) {
      case 33:
        signalId = this.low_signal_ID
        break
      case 66:
        signalId = this.middle_signal_ID
        break
      case 99:
        signalId = this.high_signal_ID
        break
    }
  } else {
    signalId = this.off_signal_ID
  }

  this.cmdRequest(signalId, function (error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error)
      callback(error)
    } else {
      callback()
    }
  }.bind(this))
}

// ------------------------------------------------------------------------------
FanAccessory.prototype.setFanState2 = function (state, callback) {
  let signalId
  if (state.direction === 0) {
    signalId = this.clockwise_signal_ID
    this.log('[Direction: CLOCKWISE]')
  } else {
    this.log('[Direction: COUNTER CLOCKWISE]')
    signalId = this.c_clockwise_signal_ID
  }

  this.cmdRequest(signalId, function (error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error)
      callback(error)
    } else {
      callback()
    }
  }.bind(this))
}

// ------------------------------------------------------------------------------
FanAccessory.prototype.cmdRequest = function (signalId, callback) {
  const url = ' "https://api.nature.global/1/signals/' + signalId + '/send"'
  const param1 = 'curl -X POST'
  const param2 = ' -H "accept":"application/json"'
  const param3 = ' -k --header "Authorization":"Bearer'
  const param4 = ' ' + this.access_token + '"'
  const paramAll = param1 + url + param2 + param3 + param4

  exec(paramAll, function (error, stdout, stderr) {
    callback(error, stdout, stderr)
  })
}
