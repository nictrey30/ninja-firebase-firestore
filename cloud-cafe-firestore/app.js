// dom queries
const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create element and render cafe
const rendercafe = (doc) => {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);

  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'x';

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  cafeList.appendChild(li);
};

// getting data
// db.collection('cafes')
//   // .where('city', '==', 'Manchester')
//   .orderBy('name')
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => rendercafe(doc));
//   });

// real-time listener
db.collection('cafes')
  .orderBy('city')
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    // console.log(changes);
    changes.forEach((change) => {
      console.log(change.type, ': ', change.doc.data());
      switch (change.type) {
        case 'added':
          rendercafe(change.doc);
          break;
        case 'removed':
          let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
          li.remove();
          console.log('li removed');
          break;
      }
    });
  });

// saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('cafes')
    .add({
      name: form.name.value.trim(),
      city: form.city.value.trim()
    })
    .then((response) => console.log(response));
  form.reset();
});

// deleting data
cafeList.addEventListener('click', (e) => {
  // get the div where the x is
  if (e.target.tagName === 'DIV') {
    // console.log(e.target.parentElement.dataset.id);
    db.collection('cafes')
      .doc(e.target.parentElement.dataset.id)
      .delete()
      .then(console.log('document deleted'))
      .catch((err) => console.log(err));
  }
});
