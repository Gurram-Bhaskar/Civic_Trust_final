import React, { useState } from 'react';
import { ArrowLeft, MapPin, Camera, Upload, Loader2, Check, Trash2, AlertTriangle, Lightbulb, Droplets, FileText } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

const ReportIssue = ({ onBack }) => {
    const { addReport, incrementScore } = useCivic();
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const issueTypes = [
        { id: 'Garbage', label: 'Garbage Dump', icon: <Trash2 className="w-6 h-6" />, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        { id: 'Pothole', label: 'Pothole', icon: <div className="w-6 h-6 rounded-full border-4 border-current" />, color: 'text-slate-600 bg-slate-100 border-slate-200' },
        { id: 'Street Light', label: 'Street Light', icon: <Lightbulb className="w-6 h-6" />, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
        { id: 'Water Leak', label: 'Water Leak', icon: <Droplets className="w-6 h-6" />, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
        { id: 'Other', label: 'Other', icon: <FileText className="w-6 h-6" />, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    ];

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Ideally reverse geocode here, but for now show coords or a generic message
                    // We'll just use a formatted string for the prototype
                    setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    setIsLocating(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Could not get your location. Please enter it manually.');
                    setIsLocating(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
            setIsLocating(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!issueType || !description || !location) return;

        setIsSubmitting(true);

        try {
            let imageUrl = null;

            // 1. Upload Image to Cloudinary if exists
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', 'Civictrust');
                formData.append('cloud_name', 'dmhxgp3hf');

                try {
                    const uploadRes = await fetch(
                        'https://api.cloudinary.com/v1_1/dmhxgp3hf/image/upload',
                        {
                            method: 'POST',
                            body: formData
                        }
                    );

                    if (uploadRes.ok) {
                        const data = await uploadRes.json();
                        imageUrl = data.secure_url; // Cloudinary returns secure_url
                    } else {
                        throw new Error('Image upload failed');
                    }
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    alert('Failed to upload image. Please try again.');
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2. Submit Report
            const newReport = {
                type: issueType,
                location: location,
                status: 'In Progress',
                timestamp: 'Just now',
                description: description,
                image: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'
            };

            await addReport(newReport);

            // 3. Award Points
            await incrementScore(10);

            setIsSubmitting(false);
            setShowSuccess(true);

            setTimeout(() => {
                onBack();
            }, 2000);

        } catch (error) {
            console.error('Error submitting report:', error);
            setIsSubmitting(false);
            alert('Failed to submit report: ' + error.message);
        }
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-300">
                <div className="bg-green-100 p-6 rounded-full mb-4">
                    <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted!</h2>
                <p className="text-slate-500 mb-6">Thank you for helping our city.</p>
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-bounce">
                    <span className="text-2xl">🏆</span>
                    <span className="font-bold text-amber-700">+10 Civic Points</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Report an Issue</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Issue Type Section */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide">What's the issue?</label>
                    <div className="grid grid-cols-2 gap-3">
                        {issueTypes.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setIssueType(type.id)}
                                className={`p-3 rounded-xl border-2 text-left transition-all flex flex-row items-center gap-3 group ${issueType === type.id
                                    ? 'border-blue-600 bg-blue-50 shadow-sm shadow-blue-100'
                                    : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg w-fit transition-colors ${issueType === type.id ? 'bg-blue-100 text-blue-600' : type.color}`}>
                                    {type.icon}
                                </div>
                                <span className={`font-semibold text-sm ${issueType === type.id ? 'text-blue-700' : 'text-slate-600'}`}>{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Location</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location or use GPS"
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleLocation}
                            disabled={isLocating}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-70"
                        >
                            {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the issue..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-32 resize-none"
                        required
                    />
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Photo Evidence</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                            {imagePreview ? (
                                <div className="relative w-full h-48">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                        <p className="text-white font-medium flex items-center gap-2"><Camera className="w-5 h-5" /> Change Photo</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 p-3 rounded-full mb-3 group-hover:bg-white transition-colors">
                                        <Camera className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">Tap to take a photo</p>
                                    <p className="text-xs text-slate-400 mt-1">Use your camera to capture the issue</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !issueType || !description || !location}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                        </>
                    ) : (
                        <>
                            Submit Report <Upload className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ReportIssue;
