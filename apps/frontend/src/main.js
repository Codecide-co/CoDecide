import '@/styles/index.css'

const app = document.getElementById('app');

app.innerHTML = `
  <main>
    <h1 id="welcome" class="welcome">
      Welcome <span id="member-name" class="member-name"></span> to initial CokeDecide
    </h1>

    
    <div>
      <button id="click-me" class="click-me">Click me</button>
    </div>

  </main>
`


document.addEventListener('DOMContentLoaded', () => {
  
  const clickMeButton = document.getElementById('click-me');
  const memberNameSpan = document.getElementById('member-name');
  const members = ['Gustavo', 'Mari', 'Andrea', 'Brandon', 'Carlos', 'Juan'];

  memberNameSpan.textContent = members[Math.floor(Math.random() * members.length)];
  

  clickMeButton.addEventListener('click', () => {
    memberNameSpan.textContent = members[Math.floor(Math.random() * members.length)];
  });
});