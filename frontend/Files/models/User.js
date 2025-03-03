/**
 * User model representing the user profile and health information
 */
class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.age = data.age || null;
        this.gender = data.gender || '';
        this.weight = data.weight || null;
        this.height = data.height || null;
        this.smoker = data.smoker || false;
        this.familyHistory = data.familyHistory || false;
        this.hypertension = data.hypertension || false;
        this.diabetes = data.diabetes || false;
        this.cholesterol = data.cholesterol || null;
        this.bloodPressureSystolic = data.bloodPressureSystolic || null;
        this.bloodPressureDiastolic = data.bloodPressureDiastolic || null;
        this.lastUpdated = data.lastUpdated || new Date().toISOString();
    }

    get bmi() {
        if (!this.weight || !this.height) return null;
        const heightInMeters = this.height / 100;
        return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    get hasCompleteProfile() {
        return !!(this.age && this.gender);
    }

    get hasCompleteHealthData() {
        return !!(
            this.age &&
            this.gender &&
            (this.bloodPressureSystolic !== null) &&
            (this.bloodPressureDiastolic !== null)
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            gender: this.gender,
            weight: this.weight,
            height: this.height,
            smoker: this.smoker,
            familyHistory: this.familyHistory,
            hypertension: this.hypertension,
            diabetes: this.diabetes,
            cholesterol: this.cholesterol,
            bloodPressureSystolic: this.bloodPressureSystolic,
            bloodPressureDiastolic: this.bloodPressureDiastolic,
            lastUpdated: this.lastUpdated
        };
    }
}

export default User;