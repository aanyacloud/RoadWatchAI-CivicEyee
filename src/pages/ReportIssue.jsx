import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  saveOfflineComplaint
} from '../utils/offlineStorage'

export default function ReportIssue() {
  const [language] = useState(localStorage.getItem('language') || 'en');

  const translations = {
    en: {
      title: 'Report Road Issue',
      subtitle:
        'Upload road damage images and submit complaints directly to responsible authorities.',
      back: 'Back Home',
      upload: 'Upload Road Image',
      uploaded: 'Uploaded Image',
      change: 'Change Image',
      description: 'Issue Description',
      placeholder:
        'Describe potholes, cracks, waterlogging or other road issues...',
      location: 'Live Location',
      severity: 'Severity Level',
      submit: 'Submit Complaint',
      submitting: 'Submitting...',
      detecting: 'Detecting your live location...',
      success: 'Complaint Submitted Successfully ✅',
      detectAI: 'Detect Road Damage'
    },
    hi: {
      title: 'सड़क समस्या दर्ज करें',
      subtitle:
        'सड़क क्षति की तस्वीरें अपलोड करें और शिकायत सीधे संबंधित विभाग को भेजें।',
      back: 'होम पर वापस जाएँ',
      upload: 'सड़क की तस्वीर अपलोड करें',
      uploaded: 'अपलोड की गई तस्वीर',
      change: 'तस्वीर बदलें',
      description: 'समस्या का विवरण',
      placeholder:
        'गड्ढों, दरारों, जलभराव या अन्य सड़क समस्याओं का विवरण लिखें...',
      location: 'लाइव लोकेशन',
      severity: 'गंभीरता स्तर',
      submit: 'शिकायत दर्ज करें',
      submitting: 'सबमिट हो रहा है...',
      detecting: 'आपकी लाइव लोकेशन पता की जा रही है...',
      success: 'शिकायत सफलतापूर्वक दर्ज की गई ✅',
      detectAI: 'AI सड़क क्षति पहचानें'
    }
  };

  const t = translations[language];

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('Low');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [aiDetection, setAiDetection] = useState('');
  const [status, setStatus] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [networkStatus, setNetworkStatus] = useState('Checking...');
  const [networkType, setNetworkType] = useState('');

  // Network detection
  useEffect(() => {
    const updateNetwork = () => {
      if (navigator.onLine) {
        setNetworkStatus('Online');
        const connection =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;
        if (connection) setNetworkType(connection.effectiveType);
      } else {
        setNetworkStatus('Offline');
        setNetworkType('No Internet');
      }
    };
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
    };
  }, []);

  // Live location detection
useEffect(() => {

  if (!navigator.geolocation) return;

  setDetectingLocation(true);

  navigator.geolocation.getCurrentPosition(

    async (pos) => {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      console.log("Latitude:", lat);
      console.log("Longitude:", lng);

      setCoordinates({
        latitude: lat,
        longitude: lng
      });

      try {

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();

        console.log("Location Response:", data);

        const fullLocation =
          data.display_name ||
          `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        setLocation(fullLocation);

        localStorage.setItem(
          'cachedLocation',
          fullLocation
        );

      } catch (error) {

        console.error(error);

        const cached =
          localStorage.getItem(
            'cachedLocation'
          );

        setLocation(
          cached
            ? cached
            : `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
        );

      }

      setDetectingLocation(false);

    },

    (error) => {

      console.error(error);

      const cached =
        localStorage.getItem(
          'cachedLocation'
        );

      if (cached) {
        setLocation(cached);
      }

      setDetectingLocation(false);

    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

  );

}, []);

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // AI detection
  const detectRoadDamage = async () => {
    if (!imageFile) return alert('Please upload image first');
    if (!navigator.onLine) alert('Offline Mode: Limited Features');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/detect', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResultImage(data.image);
      setAiDetection(data.detection);
      setStatus(data.status);
    } catch (err) {
      console.error(err);
      alert('AI Detection Failed');
    }
  };

  // Submit complaint
  const handleSubmit = async (e) => {

  e.preventDefault()

  if (!imageFile) {

    alert(
      language === 'hi'
        ? 'कृपया तस्वीर अपलोड करें'
        : 'Please upload an image'
    )

    return
  }

  setLoading(true)

  try {

    const complaintData = {

      imageUrl: image,

      resultImage,

      aiDetection,

      status,

      description,

      location,

      severity,

      networkStatus,

      networkType,

      latitude:
        coordinates?.latitude || null,

      longitude:
        coordinates?.longitude || null,

      createdAt:
        new Date().toISOString()

    }

    // OFFLINE MODE
    if (!navigator.onLine) {

      saveOfflineComplaint(
        complaintData
      )

      alert(
        language === 'hi'
          ? 'शिकायत ऑफलाइन सेव हो गई'
          : 'Complaint saved offline'
      )

      setImage(null)
      setImageFile(null)
      setResultImage('')
      setAiDetection('')
      setStatus('')
      setDescription('')
      setSeverity('Low')

      setLoading(false)

      return
    }

    // ONLINE MODE
    const storageRef = ref(
      storage,
      `complaints/${Date.now()}-${imageFile.name}`
    )

    await uploadBytes(
      storageRef,
      imageFile
    )

    const imageUrl =
      await getDownloadURL(
        storageRef
      )

    await addDoc(
      collection(
        db,
        'complaints'
      ),
      {
        ...complaintData,
        imageUrl
      }
    )

    alert(t.success)

    setImage(null)
    setImageFile(null)
    setResultImage('')
    setAiDetection('')
    setStatus('')
    setDescription('')
    setSeverity('Low')

  } catch (err) {

    console.error(err)

    alert(
      language === 'hi'
        ? 'कुछ गलत हुआ'
        : 'Something went wrong'
    )

  } finally {

    setLoading(false)

  }

  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <Link to="/"><h1 className="text-3xl font-bold text-green-400 cursor-pointer">RoadWatch</h1></Link>
        <Link to="/"><button className="border border-slate-600 hover:bg-slate-800 px-5 py-2 rounded-lg font-semibold transition">{t.back}</button></Link>
      </nav>

      <section className="flex justify-center items-center py-20 px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full max-w-2xl">
          <h2 className="text-5xl font-bold text-green-400 mb-4">{t.title}</h2>
          <p className="text-slate-300 mb-6">{t.subtitle}</p>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-8">
            <h3 className="text-lg font-semibold text-green-400">Network Status</h3>
            <p className="text-slate-300 mt-2">{networkStatus}</p>
            <p className="text-slate-400 text-sm mt-1">{networkType}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {!image ? (
              <div>
                <label className="block mb-3 text-lg text-slate-300">{t.upload}</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"/>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg text-slate-300">{t.uploaded}</p>
                  <label className="cursor-pointer text-green-400 hover:text-green-300">{t.change}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                  </label>
                </div>
                <img src={image} alt="Preview" onClick={() => setShowPreview(true)} className="w-full h-80 object-cover rounded-2xl border border-slate-700 cursor-pointer hover:opacity-90 transition"/>
                {resultImage && (
                  <div className="mt-6">
                    <h3 className="text-lg text-green-400 mb-3">AI Detection Result</h3>
                    <img src={resultImage} alt="Detection Result" className="w-full rounded-2xl border border-green-500"/>
                  </div>
                )}
              </div>
            )}

            {aiDetection && (
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                <h3 className="text-xl font-semibold text-green-400">AI Detection</h3>
                <p className="mt-2 text-slate-300">{aiDetection}</p>
                <h3 className="text-xl font-semibold text-yellow-400 mt-5">Status</h3>
                <p className="mt-2 text-slate-300">{status}</p>
              </div>
            )}

            <button type="button" onClick={detectRoadDamage} className="w-full bg-blue-500 hover:bg-blue-600 py-4 rounded-xl text-lg font-semibold transition">{t.detectAI}</button>

            <div>
              <label className="block mb-3 text-lg text-slate-300">{t.description}</label>
              <textarea rows="5" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder={t.placeholder} className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"></textarea>
            </div>

            <div>
              <label className="block mb-3 text-lg text-slate-300">{t.location}</label>
              <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Detecting location..." className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"/>
              {detectingLocation && <p className="text-sm text-green-400 mt-2">{t.detecting}</p>}
            </div>

            <div>
              <label className="block mb-3 text-lg text-slate-300">{t.severity}</label>
              <select value={severity} onChange={(e)=>setSeverity(e.target.value)} className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700">
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-xl text-lg font-semibold transition">
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </section>

      {showPreview && (
        <div onClick={() => setShowPreview(false)} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <img src={image} alt="Full Preview" className="max-w-full max-h-full rounded-2xl"/>
        </div>
      )}
    </div>
  );
}