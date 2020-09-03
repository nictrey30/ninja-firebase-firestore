const list = document.querySelector('ul');
const form = document.querySelector('form');

// function that creates a html snippet for each recipe
const addRecipe = (recipe, id) => {
  let time = recipe.created_at.toDate();
  let html = `
    <li data-id="${id}">
      <div>${recipe.title}</div>
      <div>${time}</div>
      <button class="btn btn-danger btn-sm my-2">delete</button>
    </li>
  `;
  list.innerHTML += html;
};

// delete the recipe from the template UI
const deleteRecipe = (id) => {
  const recipes = document.querySelectorAll('li');
  recipes.forEach((recipe) => {
    if (recipe.dataset.id === id) {
      // remove recipe from the DOM
      recipe.remove();
    }
  });
};

// get documents - without realtime
// db.collection('recipes')
//   .get()
//   .then((snapshot) => {
//     // a snapshot is a picture of how the collection look in that moment
//     snapshot.docs.forEach((doc) => {
//       // console.log(doc.id);
//       addRecipe(doc.data(), doc.id);
//     });
//   })
//   .catch((err) => console.log(err));

// get documents - real time listeners
// when we set up a real time listener it returns a function
const unsub = db.collection('recipes').onSnapshot((snapshot) => {
  // console.log(snapshot);
  // the docChanges() method on the snapshot's proto gets us all the changes in the database that's happened - returns an array with each change that has a 'type'
  snapshot.docChanges().forEach((change) => {
    // get the actual document from each change
    const doc = change.doc;
    if (change.type === 'added') {
      addRecipe(doc.data(), doc.id);
    } else if (change.type === 'removed') {
      deleteRecipe(doc.id);
    }
  });
});

// unsubscribe from changes
const button = document.querySelector('button');
button.addEventListener('click', () => {
  unsub();
  console.log('unsubscribed from collection changes');
});

// add documents
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const now = new Date();
  // construct an object that represent a recipe
  const recipe = {
    title: form.recipe.value,
    // create a timestamp firestore object based on a date
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };
  db.collection('recipes')
    .add(recipe)
    .then(() => {
      console.log('recipe added');
    })
    .catch((err) => console.log(err));
});

// deleting data
list.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.parentElement.dataset.id;
    // console.log(id);
    // .doc() gets a reference of a single document
    db.collection('recipes')
      .doc(id)
      .delete()
      .then(() => console.log('recipe deleted'))
      .catch((err) => console.log(err));
  }
});
