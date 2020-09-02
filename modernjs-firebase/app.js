const list = document.querySelector('ul');

// function that creates a html snippet for each recipe
const addrecipe = (recipe) => {
  let time = recipe.created_at.toDate();
  let html = `
    <li>
      <div>${recipe.title}</div>
      <div>${time}</div>
    </li>
  `;
  list.innerHTML += html;
};

db.collection('recipes')
  .get()
  .then((snapshot) => {
    // a snapshot is a picture of how the collection look in that moment
    snapshot.docs.forEach((doc) => {
      addrecipe(doc.data());
    });
  })
  .catch((err) => console.log(err));
