const input = document.getElementById('textInput');
const button = document.getElementById('applyBtn');
const container = document.getElementById('textContainer');

let selectedLetters = [];
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragLetters = [];
let dragPositions = [];

button.addEventListener('click', () => {
  renderText(input.value);
});

const renderText = text => {
  container.innerHTML = '';
  selectedLetters = [];

  [...text].forEach((char, index) => {
    const letter = document.createElement('span');
    letter.textContent = char;
    letter.className = 'letter';
    letter.style.left = `${index * 25}px`;
    letter.style.top = '0px';
    container.appendChild(letter);

    letter.addEventListener('mousedown', handleMouseDown);
    letter.addEventListener('click', handleLetterClick);
  });

  document.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('letter')) {
      clearSelection();
    }
  });
};

const clearSelection = () => {
  document.querySelectorAll('.letter.selected').forEach(letter => {
    letter.classList.remove('selected');
  });
  selectedLetters = [];
};

const handleLetterClick = e => {
  const letter = e.target;

  if (e.ctrlKey) {
    if (letter.classList.contains('selected')) {
      letter.classList.remove('selected');
      selectedLetters = selectedLetters.filter(l => l !== letter);
    } else {
      letter.classList.add('selected');
      selectedLetters.push(letter);
    }
  } else {
    clearSelection();
    letter.classList.add('selected');
    selectedLetters.push(letter);
  }

  e.stopPropagation();
};

const handleMouseDown = e => {
  if (e.ctrlKey) return;
  const letter = e.target;

  if (!selectedLetters.includes(letter)) {
    clearSelection();
    letter.classList.add('selected');
    selectedLetters.push(letter);
  }

  dragLetters = [...selectedLetters];
  dragPositions = dragLetters.map(l => ({
    el: l,
    left: parseFloat(l.style.left),
    top: parseFloat(l.style.top),
  }));

  dragStartX = e.pageX;
  dragStartY = e.pageY;
  isDragging = true;

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  e.preventDefault();
};

const handleMouseMove = e => {
  if (!isDragging) return;

  const dx = e.pageX - dragStartX;
  const dy = e.pageY - dragStartY;

  dragPositions.forEach(pos => {
    pos.el.style.left = `${pos.left + dx}px`;
    pos.el.style.top = `${pos.top + dy}px`;
  });
};

const handleMouseUp = () => {
  isDragging = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};
