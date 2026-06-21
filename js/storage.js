import { getPublications, savePublications } from './github-api.js';

const STORAGE_KEYS = {
  PHOTOS: '2madrugadas_photos',
  VIDEOS: '2madrugadas_videos',
  ESSAYS: '2madrugadas_essays'
};

let cachedData = null;

async function loadFromGitHub() {
  try {
    const data = await getPublications();
    cachedData = data;
    return data;
  } catch (error) {
    console.error('Error loading from GitHub:', error);
    return { photos: [], videos: [], essays: [] };
  }
}

async function saveToGitHub() {
  try {
    if (!cachedData) {
      cachedData = await loadFromGitHub();
    }
    await savePublications(cachedData);
    return true;
  } catch (error) {
    console.error('Error saving to GitHub:', error);
    return false;
  }
}

export function getPhotos() {
  if (cachedData) {
    return cachedData.photos || [];
  }
  const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
  return data ? JSON.parse(data) : [];
}

export async function savePhotos(photos) {
  if (!cachedData) {
    cachedData = await loadFromGitHub();
  }
  cachedData.photos = photos;
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  return saveToGitHub();
}

export async function addPhoto(photo) {
  const photos = getPhotos();
  photos.unshift(photo);
  return savePhotos(photos);
}

export async function deletePhoto(id) {
  const photos = getPhotos().filter(p => p.id !== id);
  return savePhotos(photos);
}

export function getVideos() {
  if (cachedData) {
    return cachedData.videos || [];
  }
  const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  return data ? JSON.parse(data) : [];
}

export async function saveVideos(videos) {
  if (!cachedData) {
    cachedData = await loadFromGitHub();
  }
  cachedData.videos = videos;
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  return saveToGitHub();
}

export async function addVideo(video) {
  const videos = getVideos();
  videos.unshift(video);
  return saveVideos(videos);
}

export async function deleteVideo(id) {
  const videos = getVideos().filter(v => v.id !== id);
  return saveVideos(videos);
}

export function getEssays() {
  if (cachedData) {
    return cachedData.essays || [];
  }
  const data = localStorage.getItem(STORAGE_KEYS.ESSAYS);
  return data ? JSON.parse(data) : [];
}

export async function saveEssays(essays) {
  if (!cachedData) {
    cachedData = await loadFromGitHub();
  }
  cachedData.essays = essays;
  localStorage.setItem(STORAGE_KEYS.ESSAYS, JSON.stringify(essays));
  return saveToGitHub();
}

export async function addEssay(essay) {
  const essays = getEssays();
  essays.unshift(essay);
  return saveEssays(essays);
}

export async function deleteEssay(id) {
  const essays = getEssays().filter(e => e.id !== id);
  return saveEssays(essays);
}

export function exportAllData() {
  const data = {
    photos: getPhotos(),
    videos: getVideos(),
    essays: getEssays()
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.photos) savePhotos(data.photos);
    if (data.videos) saveVideos(data.videos);
    if (data.essays) saveEssays(data.essays);
    return true;
  } catch (e) {
    return false;
  }
}

export async function initializeFromGitHub() {
  cachedData = await loadFromGitHub();
  return cachedData;
}
