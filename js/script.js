// Funcionalidad 
document.getElementById('uploadProfileBtn').addEventListener('click', () => {
  document.getElementById('profileInput').click();
});

document.getElementById('profileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('profileImage').src = event.target.result;
    
      localStorage.setItem('profileImage', event.target.result);
      showNotification('Foto de perfil actualizada ✓');
    };
    reader.readAsDataURL(file);
  }
});

window.addEventListener('load', () => {
  const savedProfile = localStorage.getItem('profileImage');
  if (savedProfile) {
    document.getElementById('profileImage').src = savedProfile;
  }
  loadPractices();
});

document.getElementById('addPracticeBtn').addEventListener('click', () => {
  const practicesList = document.getElementById('practicesList');
  const practiceCount = practicesList.children.length + 1;
  
  if (practiceCount > 20) {
    showNotification('Máximo 20 prácticas permitidas', 'error');
    return;
  }
  
  const newPractice = document.createElement('li');
  newPractice.className = 'practice-item';
  newPractice.setAttribute('data-practice', practiceCount);
  newPractice.innerHTML = `
    <div class="practice-info">
      <strong>Practica ${practiceCount}:</strong> 
      <input type="text" placeholder="URL del proyecto" class="practice-url" data-practice="${practiceCount}">
    </div>
    <div class="practice-actions">
      <button class="btn-upload-pdf" onclick="document.getElementById('pdf${practiceCount}').click()" title="Subir PDF">📄</button>
      <input type="file" id="pdf${practiceCount}" accept=".pdf" style="display:none;" onchange="handlePdfUpload(${practiceCount}, this)">
      <a id="pdf${practiceCount}-link" href="" download class="btn-download" style="display:none;">📥</a>
      <button class="btn-delete" onclick="deletePractice(${practiceCount})" title="Eliminar práctica">🗑️</button>
    </div>
  `;
  
  practicesList.appendChild(newPractice);
  savePractices();
  showNotification(`Práctica ${practiceCount} agregada ✓`);
});

function handlePdfUpload(practiceNum, input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const link = document.getElementById(`pdf${practiceNum}-link`);
      link.href = event.target.result;
      link.style.display = 'inline-block';
      link.download = `practica${practiceNum}.pdf`;
      savePractices();
      showNotification(`PDF de Práctica ${practiceNum} cargado ✓`);
    };
    reader.readAsDataURL(file);
  }
}

function deletePractice(practiceNum) {
  if (confirm(`¿Eliminar Práctica ${practiceNum}?`)) {
    const practice = document.querySelector(`[data-practice="${practiceNum}"]`);
    if (practice) {
      practice.remove();
      savePractices();
      showNotification(`Práctica ${practiceNum} eliminada ✓`);
    }
  }
}

function savePractices() {
  const practices = [];
  document.querySelectorAll('.practice-item').forEach((item, index) => {
    const practiceNum = item.getAttribute('data-practice');
    const urlInput = item.querySelector('.practice-url');
    const pdfLink = item.querySelector(`a[id*="-link"]`);
    
    practices.push({
      number: practiceNum,
      url: urlInput ? urlInput.value : '',
      pdf: pdfLink ? pdfLink.href : ''
    });
  });
  
  localStorage.setItem('practices', JSON.stringify(practices));
}

function loadPractices() {
  const saved = localStorage.getItem('practices');
  if (saved) {
    try {
      const practices = JSON.parse(saved);
      practices.forEach(p => {
        const item = document.querySelector(`[data-practice="${p.number}"]`);
        if (item) {
          const urlInput = item.querySelector('.practice-url');
          const pdfLink = item.querySelector(`a[id*="-link"]`);
          
          if (urlInput) urlInput.value = p.url;
          if (pdfLink && p.pdf) {
            pdfLink.href = p.pdf;
            pdfLink.style.display = 'inline-block';
          }
        }
      });
    } catch (e) {
      console.error('Error cargando prácticas:', e);
    }
  }
}

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('practice-url')) {
    savePractices();
  }
});

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
