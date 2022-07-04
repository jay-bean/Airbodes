import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getDigs, editDig } from '../../store/digs';
import '../../main.css';

function EditDigForm() {
  const digIdObj = useParams();
  const id = digIdObj.digId;
  const dig = useSelector(state => state.digs[id]);
  const history = useHistory();
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState([]);
  const [address, setAddress] = useState(dig ? dig.address : '');
  const [city, setCity] = useState(dig ? dig.city : '');
  const [state, setState] = useState(dig ? dig.state : '');
  const [country, setCountry] = useState(dig ? dig.country : '');
  const [title, setTitle] = useState(dig ? dig.title : '');
  const [price, setPrice] = useState(dig ? dig.price : '');
  const [description, setDescription] = useState(dig ? dig.description : '');
  const [guests, setGuests] = useState(dig ? dig.guests : '');
  const [bedrooms, setBedrooms] = useState(dig ? dig.bedrooms : '');
  const [beds, setBeds] = useState(dig ? dig.beds : '');
  const [baths, setBaths] = useState(dig ? dig.baths : '');
  const [pets, setPets] = useState(dig && dig.pets ? 'yes' : 'no');
  const [images, setImages] = useState(dig && dig.images.length ? dig.images : '');
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getDigs());
  }, [dispatch])

  const handleCancel = (e) => {
    setValidationErrors([]);
    history.push("/")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('country', country);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('guests', guests);
    formData.append('bedrooms', bedrooms);
    formData.append('beds', beds);
    formData.append('baths', baths);
    formData.append('pets', pets);
    formData.append('userId', sessionUser.id);
    console.log(images)
    for(const image of Object.keys(images)) {
      console.log(images[image], 'this is a string');
      formData.append('image', images[image]);
    }

    console.log(images, 'second image')
    let newDig;
    try {
      newDig = await dispatch(editDig(formData, id));
    }
    catch (error) {
      console.log(error, 'errrr');
      const err = await error.json();
      if (error.status === 500) setValidationErrors([err.message])
      else setValidationErrors(err);
    }

    if (newDig) {
      setValidationErrors([]);
      history.push(`/digs/${newDig.id}`);
    }
  }

  return (
    <>
      <h1>Edit Home</h1>
      {validationErrors.length > 0 && (
        validationErrors.map(error => {
          return <div>{error}</div>
        })
      )}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label> Address:
        <input
          type="address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        </label>
        <label> City:
        <input
          type="city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        </label>
        <label> State/Province:
        <input
          type="state"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        </label>
        <label> Country:
        <input
          type="country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        </label>
        <label> Title:
        <input
          type="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        </label>
        <label> Price per night:
        <input
          type="price"
          min='1'
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        </label>
        <label> Description:
        <textarea
          type="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </label>
        <label> Guests:
        <input
          type="number"
          min='1'
          required
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
        </label>
        <label> Bedrooms:
        <input
          type="number"
          min='1'
          required
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
        </label>
        <label> Beds:
        <input
          type="number"
          min='1'
          required
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
        />
        </label>
        <label> Bathrooms:
        <input
          type="number"
          min='1'
          required
          value={baths}
          onChange={(e) => setBaths(e.target.value)}
        />
        </label>
        <label> Pets Okay?
        <input
          type="radio"
          value="yes"
          name="pets"
          onChange={(e) => setPets(e.target.value)}
          checked={pets === 'yes'}
        /> Yes
        <input
            type="radio"
            value="no"
            name="pets"
            onChange={(e) => setPets(e.target.value)}
            checked={pets === 'no'}
        /> No
        </label>
        <label> Upload Images
        <input
          type="file"
          multiple
          name="file"
          onChange={(e) => setImages(e.target.files)}
        />
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </>
  );
}

export default EditDigForm;
