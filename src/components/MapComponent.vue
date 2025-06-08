<template>
  <div class="map-container">
    <div ref="mapElement" class="w-full h-full rounded-xl"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import type { Spot } from '@/types'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = defaultIcon

interface Props {
  spots: Spot[]
  center?: [number, number]
  zoom?: number
  height?: string
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [50.8503, 4.3517], // Default to Brussels, Belgium
  zoom: 8,
  height: '400px',
  showControls: true
})

const emit = defineEmits<{
  'spot-click': [spot: Spot]
}>()

const mapElement = ref<HTMLElement>()
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null

const initializeMap = () => {
  if (!mapElement.value) return

  // Create map
  map = L.map(mapElement.value, {
    zoomControl: props.showControls,
    scrollWheelZoom: true,
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true
  }).setView(props.center, props.zoom)

  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Create markers layer
  markersLayer = L.layerGroup().addTo(map)

  // Add spots markers
  updateMarkers()
}

const updateMarkers = () => {
  if (!map || !markersLayer) return

  // Clear existing markers
  markersLayer.clearLayers()

  // Add markers for spots with coordinates
  const spotsWithCoordinates = props.spots.filter(spot => spot.latitude && spot.longitude)
  
  spotsWithCoordinates.forEach(spot => {
    if (!spot.latitude || !spot.longitude) return

    // Create custom camping icon
    const campingIcon = L.divIcon({
      html: `
        <div class="camping-marker">
          <div class="marker-content">
            <span class="marker-icon">🏕️</span>
          </div>
          <div class="marker-price">€${spot.price}</div>
        </div>
      `,
      className: 'custom-camping-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    })

    const marker = L.marker([spot.latitude, spot.longitude], { icon: campingIcon })

    // Create popup content
    const popupContent = `
      <div class="map-popup">
        <div class="popup-header">
          <h3 class="popup-title">${spot.title}</h3>
          <div class="popup-price">€${spot.price}/night</div>
        </div>
        <div class="popup-location">📍 ${spot.location}</div>
        ${spot.averageRating ? 
          `<div class="popup-rating">
            ⭐ ${spot.averageRating.toFixed(1)} (${spot.totalRatings} reviews)
          </div>` : 
          '<div class="popup-rating">⭐ New spot</div>'
        }
        <div class="popup-description">${spot.description.slice(0, 100)}${spot.description.length > 100 ? '...' : ''}</div>
        <button class="popup-btn" onclick="window.dispatchEvent(new CustomEvent('spot-click', { detail: '${spot.id}' }))">
          View Details
        </button>
      </div>
    `

    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup'
    })

    marker.addTo(markersLayer!)
  })

  // Fit map to show all markers if there are any
  if (spotsWithCoordinates.length > 0) {
    const group = L.featureGroup(markersLayer!.getLayers() as L.Layer[])
    map!.fitBounds(group.getBounds().pad(0.1))
  }
}

// Listen for spot click events from popup
const handleSpotClick = (event: CustomEvent) => {
  const spotId = event.detail
  const spot = props.spots.find(s => s.id === spotId)
  if (spot) {
    emit('spot-click', spot)
  }
}

onMounted(() => {
  initializeMap()
  window.addEventListener('spot-click', handleSpotClick as EventListener)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  window.removeEventListener('spot-click', handleSpotClick as EventListener)
})

// Watch for changes in spots
watch(() => props.spots, () => {
  updateMarkers()
}, { deep: true })
</script>

<style scoped>
.map-container {
  height: v-bind(height);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Custom marker styles */
:deep(.custom-camping-marker) {
  background: transparent;
  border: none;
}

:deep(.camping-marker) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-content) {
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.marker-icon) {
  font-size: 16px;
}

:deep(.marker-price) {
  background: #1e40af;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  margin-top: 2px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Custom popup styles */
:deep(.custom-popup .leaflet-popup-content-wrapper) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: none;
  padding: 0;
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 0;
  padding: 0;
}

:deep(.custom-popup .leaflet-popup-tip) {
  background: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.map-popup) {
  padding: 16px;
  min-width: 250px;
}

:deep(.popup-header) {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

:deep(.popup-title) {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  flex: 1;
  margin-right: 8px;
}

:deep(.popup-price) {
  background: #1e40af;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

:deep(.popup-location) {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.popup-rating) {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
}

:deep(.popup-description) {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
}

:deep(.popup-btn) {
  background: #1e40af;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

:deep(.popup-btn:hover) {
  background: #1d4ed8;
}
</style> 