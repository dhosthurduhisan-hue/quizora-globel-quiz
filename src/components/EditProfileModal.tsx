import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES_DATA } from '../data/categories';
import {
  X,
  User,
  Camera,
  Check,
  Sparkles,
  Bookmark,
  FileText,
  Upload
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAvatarUpload: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAvatarUpload,
}) => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [favoriteCategory, setFavoriteCategory] = useState(
    user.favoriteCategories?.[0] || 'science'
  );

  // Sync state if user opens modal
  React.useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setBio(user.bio || '');
      setSelectedAvatar(user.avatarUrl);
      setFavoriteCategory(user.favoriteCategories?.[0] || 'science');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      avatarUrl: selectedAvatar,
      favoriteCategories: [favoriteCategory],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Edit Profile</h2>
              <p className="text-xs text-slate-400">Update your public name, photo, and details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Avatar Preview & Options */}
          <div className="space-y-3">
            <label className="text-slate-300 font-semibold block">Profile Avatar</label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg shrink-0">
                <img
                  src={selectedAvatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="text-[11px] text-slate-400">Pick a quick avatar or upload your photo:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatar === url
                          ? 'border-indigo-400 scale-105 shadow-md shadow-indigo-600/30'
                          : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAvatarUpload();
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
                  >
                    <Upload className="w-3 h-3 text-indigo-400" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom URL Input toggle */}
            <div>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedAvatar(e.target.value.trim());
                  }
                }}
                placeholder="Or paste an image URL directly..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Display Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Newton"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium transition-colors"
            />
          </div>

          {/* Bio / Tagline */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Bio / Custom Title</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Quantum logic enthusiast & speed solver"
              maxLength={120}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium transition-colors"
            />
            <div className="text-[10px] text-slate-500 text-right">{bio.length}/120 characters</div>
          </div>

          {/* Preferred Category Focus */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Primary Domain Focus</label>
            <select
              value={favoriteCategory}
              onChange={(e) => setFavoriteCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
            >
              {CATEGORIES_DATA.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
