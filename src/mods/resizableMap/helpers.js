import { getState, getTempState, saveState } from '../../utils/state';

// When the map container resizes, we want to update the canvas width/height and the state
function onMapResize(e) {
	if (!document.querySelector('.layout')) {
		return;
	}

	const state = getState();
	const tempState = getTempState();
	const $map = document.querySelector('.container canvas').parentNode;
	const $canvas = $map.querySelector('canvas');

	// Get real values of map height/width, excluding padding/margin/etc
	const mapWidthStr = window.getComputedStyle($map, null).getPropertyValue('width');
	const mapHeightStr = window.getComputedStyle($map, null).getPropertyValue('height');
	const mapWidth = Number(mapWidthStr.slice(0, -2));
	const mapHeight = Number(mapHeightStr.slice(0, -2));

	// If height/width are 0 or unset, don't resize canvas
	if (!mapWidth || !mapHeight) {
		return;
	}

	if ($canvas.width !== mapWidth) {
		$canvas.width = mapWidth;
	}

	if ($canvas.height !== mapHeight) {
		$canvas.height = mapHeight;
	}

	// If we're clicking map, i.e. manually resizing, then save state
	// Don't save state when minimizing/maximizing map via [M]
	if (tempState.clickingMap) {
		state.mapWidth = mapWidthStr;
		state.mapHeight = mapHeightStr;
		saveState();
	} else {
		const isMaximized =
			mapWidth > tempState.lastMapWidth && mapHeight > tempState.lastMapHeight;
		if (!isMaximized) {
			$map.style.width = state.mapWidth;
			$map.style.height = state.mapHeight;
		}
	}

	// Store last map width/height in temp state, so we know if we've minimized or maximized
	tempState.lastMapWidth = mapWidth;
	tempState.lastMapHeight = mapHeight;
}

// We need to observe canvas resizes to tell when the user presses M to open the big map
// At that point, we resize the map to match the canvas
function triggerMapResize() {
	if (!document.querySelector('.layout')) {
		return;
	}

	const $map = document.querySelector('.container canvas').parentNode;
	const $canvas = $map.querySelector('canvas');

	// Get real values of map height/width, excluding padding/margin/etc
	const mapWidthStr = window.getComputedStyle($map, null).getPropertyValue('width');
	const mapHeightStr = window.getComputedStyle($map, null).getPropertyValue('height');
	const mapWidth = Number(mapWidthStr.slice(0, -2));
	const mapHeight = Number(mapHeightStr.slice(0, -2));

	// If height/width are 0 or unset, we don't care about resizing yet
	if (!mapWidth || !mapHeight) {
		return;
	}

	if ($canvas.width !== mapWidth) {
		$map.style.width = `${$canvas.width}px`;
	}

	if ($canvas.height !== mapHeight) {
		$map.style.height = `${$canvas.height}px`;
	}
}

export { onMapResize, triggerMapResize };
