import styles from '../styles/RegisterPageStyles/RegisterProfilePageStyle.module.css';
import { useState } from "react";
import { handleInputChange } from '../functions/formChangeFunction';
import placeHolderImage from '../images/placeHolder.png';
import { registerUser } from '../services/UserService';

export function RegisterForm(){
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
        if (!e.target.files[0].type.startsWith("image/")) {
            alert("Only images are allowed to be uploaded.");
            return;
        }
        setImageFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!imageFile){
        alert("Profile image is required.");
        return;
    }
    const formData = new FormData();

    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    console.log(form.username, form.email, form.password, imageFile);
    console.log(formData);
    try {
        const { message } = await registerUser(formData);
        setMessage(message);
    } 
    catch (err: any) {
        alert(`Error from server: ${err.message}`);
    }

  };

  return (
    <div className={styles.mainDiv}>
      <form className={styles.editForm} onSubmit={handleSubmit}>
        
          <h1>Register profile</h1>
          <div className={styles.formImage}>
            <img
              className={styles.profilePicture}
              src={placeHolderImage}
              alt="Profilna slika"
            />
            <label htmlFor="imageUpload" className={styles.customFileButton}>
                Upload Image
            </label>
            <input 
              id="imageUpload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className={styles.hiddenFileInput}
            />
            {fileName && (
                <p className={styles.fileName}>Selected file: {fileName}</p>
            )}
          </div>

          <div className={styles.formInputs}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              defaultValue={form.username}
              onChange={(e) => handleInputChange(e, setForm)}
              autoComplete="off"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@gmail.com"
              name="email"
              defaultValue={form.email}
              onChange={(e) => handleInputChange(e, setForm)}
              autoComplete="off"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              defaultValue={form.password}
              onChange={(e) => handleInputChange(e, setForm)}
              autoComplete="off"
              required
            />
          </div>

        {message && <p className={styles.message}>{message}</p>}
        <button className={styles.submitButton}>Register</button>

        <div className={styles.divider}></div>

        <div className={styles.loginLinkDiv}>
            <div>Already have an account?</div>
            <a href="/Login" className={styles.loginLink}>
                Login here
            </a>
        </div>
      </form>
    </div>
  );
}