/**
 * Reading model representing data collected from Bluetooth devices
 */
class Reading {
    constructor(data = {}) {
        this.id = data.id || Date.now().toString();
        this.timestamp = data.timestamp || new Date().toISOString();
        this.heartRate = data.heartRate || null;
        this.bloodPressureSystolic = data.bloodPressureSystolic || null;
        this.bloodPressureDiastolic = data.bloodPressureDiastolic || null;
        this.oxygenSaturation = data.oxygenSaturation || null;
        this.temperature = data.temperature || null;
        this.deviceId = data.deviceId || null;
        this.deviceName = data.deviceName || null;
        this.riskScore = data.riskScore || null;
        this.abnormal = data.abnormal || false;
    }

    get isComplete() {
        return this.heartRate !== null &&
            this.bloodPressureSystolic !== null &&
            this.bloodPressureDiastolic !== null;
    }

    get formattedTime() {
        return new Date(this.timestamp).toLocaleTimeString();
    }

    get formattedDate() {
        return new Date(this.timestamp).toLocaleDateString();
    }

    toJSON() {
        return {
            id: this.id,
            timestamp: this.timestamp,
            heartRate: this.heartRate,
            bloodPressureSystolic: this.bloodPressureSystolic,
            bloodPressureDiastolic: this.bloodPressureDiastolic,
            oxygenSaturation: this.oxygenSaturation,
            temperature: this.temperature,
            deviceId: this.deviceId,
            deviceName: this.deviceName,
            riskScore: this.riskScore,
            abnormal: this.abnormal
        };
    }
}

export default Reading;