export const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formSetter: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value } = e.target;
    formSetter((prevForm: any) => ({
        ...prevForm,
        [name]: value,
    }));
};