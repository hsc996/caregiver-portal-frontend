import api from './axiosInstance';

export const patientAPI = {
    getAllPatients: () =>
        api.get('/patient'),

    getPatient: (id) =>
        api.get(`/patient/${id}`),

    getPatientShifts: (id, year, month) =>
        api.get(`/patient/${id}/shifts`, {
            params: { month: `${year}-${String(month).padStart(2, '0')}` },
        }),

    updatePatient: (id, data) =>
        api.patch(`/patient/${id}`, data),

    getHandoverNotes: (id, date) =>
        api.get(`/patient/${id}/handover-notes`, { params: { date } }),

    uploadImage: (id, file, onProgress) => {
        const formData = new FormData();
        formData.append('profileImg', file);
        return api.patch(`/patient/${id}/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
                onProgress(pct);
            },
        });
    },
};
