import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, X } from 'lucide-react';
import MainNav from '../LandingPage/MainNav';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { patientAPI } from '../../api/patient';
import { useNotificationService } from '../Notifications/notificationService';

const FALLBACK_IMG = '/src/assets/images/example_profilepic.png';

function arrayToString(arr) {
    return Array.isArray(arr) ? arr.join(', ') : (arr || '');
}

function stringToArray(str) {
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

function toDateInputValue(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.toISOString().split('T')[0];
}

const emptyContact = { name: '', relationship: '', phoneNumber: '', email: '' };

function PatientProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { sendSuccessNotification, sendErrorNotification } = useNotificationService();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        allergies: '',
        alerts: '',
        emergencyContacts: [{ ...emptyContact }, { ...emptyContact }],
    });
    const [formSaving, setFormSaving] = useState(false);

    // Image upload modal
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [newImgUrl, setNewImgUrl] = useState(null);

    useEffect(() => {
        async function fetchPatient() {
            try {
                const res = await patientAPI.getPatient(id);
                const p = res.data.data;
                setPatient(p);
                const contacts = [
                    p.emergencyContacts?.[0] ?? { ...emptyContact },
                    p.emergencyContacts?.[1] ?? { ...emptyContact },
                ];
                setForm({
                    firstName: p.firstName || '',
                    lastName: p.lastName || '',
                    dateOfBirth: toDateInputValue(p.dateOfBirth),
                    allergies: arrayToString(p.allergies),
                    alerts: arrayToString(p.alerts),
                    emergencyContacts: contacts,
                });
            } catch {
                sendErrorNotification('Failed to load patient record.');
            } finally {
                setLoading(false);
            }
        }
        fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    function handleFieldChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function handleContactChange(index, field, value) {
        setForm(prev => {
            const contacts = [...prev.emergencyContacts];
            contacts[index] = { ...contacts[index], [field]: value };
            return { ...prev, emergencyContacts: contacts };
        });
    }

    async function handleFormSave(e) {
        e.preventDefault();
        setFormSaving(true);
        try {
            const payload = {
                firstName: form.firstName,
                lastName: form.lastName,
                dateOfBirth: form.dateOfBirth || undefined,
                allergies: stringToArray(form.allergies),
                alerts: stringToArray(form.alerts),
                emergencyContacts: form.emergencyContacts.filter(c => c.name || c.email || c.phoneNumber),
            };
            const res = await patientAPI.updatePatient(id, payload);
            setPatient(res.data.data);
            sendSuccessNotification('Patient record saved.');
        } catch {
            sendErrorNotification('Failed to save patient record.');
        } finally {
            setFormSaving(false);
        }
    }

    function openModal() {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        setUploading(false);
        setUploadComplete(false);
        setNewImgUrl(null);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setUploadProgress(0);
        setUploadComplete(false);
        setUploading(true);

        try {
            const res = await patientAPI.uploadImage(id, file, (pct) => {
                setUploadProgress(pct);
            });
            setNewImgUrl(res.data.data.profileImg);
            setUploadProgress(100);
            setUploadComplete(true);
        } catch {
            sendErrorNotification('Image upload failed.');
            setUploading(false);
        } finally {
            setUploading(false);
        }
    }

    function handleSaveImage() {
        if (!uploadComplete) return;
        setPatient(prev => ({ ...prev, profileImg: newImgUrl }));
        sendSuccessNotification('Profile photo updated.');
        closeModal();
    }

    const displayImg = patient?.profileImg || FALLBACK_IMG;

    if (loading) {
        return (
            <>
                <MainNav />
                <main className="mx-auto min-h-screen w-full max-w-4xl pt-30 flex items-center justify-center">
                    <p className="text-gray-500">Loading patient record...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <MainNav />
            <main className="mx-auto min-h-screen w-full max-w-4xl pt-30 px-6 pb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Patient Profile</h1>

                {/* Image section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-base">Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={displayImg}
                                    alt={patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}
                                    className="h-28 w-28 rounded-full border-4 border-indigo-100 object-cover"
                                />
                            </div>
                            <div>
                                <button
                                    onClick={openModal}
                                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    <Camera className="h-4 w-4" />
                                    Upload Photo
                                </button>
                                <p className="mt-1 text-xs text-gray-400">JPG, PNG or WebP · max 5 MB</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient details form */}
                <form onSubmit={handleFormSave} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleFieldChange}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleFieldChange}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleFieldChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Allergies</label>
                                <input
                                    type="text"
                                    name="allergies"
                                    value={form.allergies}
                                    onChange={handleFieldChange}
                                    placeholder="e.g. Penicillin, Shellfish"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <p className="text-xs text-gray-400">Separate multiple entries with commas</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Alerts</label>
                                <input
                                    type="text"
                                    name="alerts"
                                    value={form.alerts}
                                    onChange={handleFieldChange}
                                    placeholder="e.g. Fall risk, Diabetes"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <p className="text-xs text-gray-400">Separate multiple entries with commas</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Emergency Contacts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[0, 1].map((i) => (
                                <div key={i} className="space-y-3">
                                    {i === 1 && <hr className="border-gray-100" />}
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Contact {i + 1}{i === 1 ? ' (optional)' : ''}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                value={form.emergencyContacts[i].name}
                                                onChange={e => handleContactChange(i, 'name', e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Relationship</label>
                                            <input
                                                type="text"
                                                value={form.emergencyContacts[i].relationship}
                                                onChange={e => handleContactChange(i, 'relationship', e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                value={form.emergencyContacts[i].phoneNumber}
                                                onChange={e => handleContactChange(i, 'phoneNumber', e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={form.emergencyContacts[i].email}
                                                onChange={e => handleContactChange(i, 'email', e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={formSaving}
                            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            {formSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </main>

            {/* Image Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Update Profile Photo</h2>
                            <button
                                onClick={closeModal}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="mb-5 flex justify-center">
                            <img
                                src={previewUrl || displayImg}
                                alt="Preview"
                                className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover"
                            />
                        </div>

                        {/* File input (hidden) */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* Browse button */}
                        {!uploading && !uploadComplete && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mb-4 w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Browse Files
                            </button>
                        )}

                        {/* Progress bar */}
                        {(uploading || uploadComplete) && (
                            <div className="mb-4 space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                                    <span>
                                        {uploadComplete ? (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <Check className="h-3 w-3" /> Complete
                                            </span>
                                        ) : (
                                            `${uploadProgress}%`
                                        )}
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${uploadComplete ? 'bg-green-500' : 'bg-indigo-500'}`}
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveImage}
                                disabled={!uploadComplete}
                                className="flex-1 rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PatientProfile;
