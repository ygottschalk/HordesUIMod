import skills from './skills';
import { makeElement } from '../../utils/misc';

function _getSkillId(url) {
	const regex = new RegExp('skills/([a-zA-Z0-9]+).');
	const matches = url.match(regex);
	return Array.isArray(matches) ? matches[1] : null;
}

function _addBuffTooltip(mouseEvent, $buff) {
	const $skillImg = $buff.querySelector('img');
	if (!$skillImg) return;

	const skillId = _getSkillId($skillImg.getAttribute('src'));
	if (!skillId) return;

	const $buffTooltip = document.querySelector('.js-skill-tooltip');

	const skillData = skills[skillId];
	// This shouldn't happen, but just in case it does, don't show the buff tooltip
	if (!skillData) return;

	$buffTooltip.querySelector('.js-tooltip-name').textContent = skillData.name;
	$buffTooltip.querySelector('.js-tooltip-desc').textContent = skillData.description;

	// Reset current tooltip stats and add current skill's stats
	const $tooltipStats = $buffTooltip.querySelector('.js-tooltip-stats');
	$tooltipStats.innerHTML = '';
	if (skillData.stats) {
		$tooltipStats.style.display = 'block';
		$buffTooltip.querySelector('.js-buff-tooltip-effects').style.display = 'block';
		skillData.stats.forEach(statText => {
			$tooltipStats.appendChild(
				makeElement({
					element: 'div',
					class: 'textgreen',
					content: statText,
				}),
			);
		});
	} else {
		$tooltipStats.style.display = 'none';
		$buffTooltip.querySelector('.js-buff-tooltip-effects').style.display = 'none';
	}

	const boundingRect = $buff.getBoundingClientRect();

	if ($buff.closest('.buffarray.party')) {
		$buffTooltip.setAttribute(
			'style',
			`left: ${boundingRect.x + boundingRect.width + 3}px; top: ${
				boundingRect.y
			}px; display: block; transform: none;`,
		);
	} else {
		$buffTooltip.setAttribute(
			'style',
			`left: ${boundingRect.x}px; top: ${boundingRect.y -
				3}px; display: block; transform: translateY(-100%);`,
		);
	}
}

function removeBuffTooltip() {
	const $buffTooltip = document.querySelector('.js-skill-tooltip');
	if ($buffTooltip) {
		$buffTooltip.style.display = 'none';
	}
}

function handleBuffTooltipDisplay(mouseEvent, $buff) {
	const $buffMouseIsOver = document
		.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY)
		.closest('.slot.js-buff-tooltip-initd');
	// If mouse is over cooldown overlay or icon image of buff icon
	if ($buffMouseIsOver) {
		// If there is no $buff but we are over the buff icon, then this is the document.body
		// removeBuffTooltip handler, so we don't want to add the buff tooltip
		// TODO: Consider cleaning up this logic
		if ($buff && $buff === $buffMouseIsOver) _addBuffTooltip(mouseEvent, $buff);
	} else {
		removeBuffTooltip();
	}
}

export { handleBuffTooltipDisplay, removeBuffTooltip };
