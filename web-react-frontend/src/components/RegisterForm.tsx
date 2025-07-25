import styles from '../styles/RegisterPageStyles/RegisterProfilePageStyle.module.css';
import { useState } from "react";
import { handleInputChange } from '../functions/formChangeFunction';
import placeHolderImage from '../images/placeHolder.png';
import { registerUser, validateAndExtractImageFile } from '../services/UserService';
import ButtonWithText from './ButtonWithText';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../config/constants';

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
    const file = e.target.files?.[0] || null;

    const result = validateAndExtractImageFile(file);

    if (!result.valid) {
      alert(result.error);
      return;
    }

    setImageFile(result.file!);
    setFileName(result.fileName!);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!imageFile){
        alert("Profile image is required.");
        return;
    }
    if(form.password.length < MIN_PASSWORD_LENGTH || form.password.length < MAX_PASSWORD_LENGTH){
      alert(`Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters!`);
      return;
    }
    const formData = new FormData();

    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

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
              onChange={(e) => handleInputChange(e, setForm, "string")}
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
              onChange={(e) => handleInputChange(e, setForm, "string")}
              autoComplete="off"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              defaultValue={form.password}
              onChange={(e) => handleInputChange(e, setForm, "string")}
              autoComplete="off"
              required
            />
          </div>

        {message && <p className={styles.message}>{message}</p>}
        <ButtonWithText text="Register" type="submit" />

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