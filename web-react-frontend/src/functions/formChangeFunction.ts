export const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, formSetter: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value } = e.target;
    formSetter((prevForm: any) => ({
        ...prevForm,
        [name]: value,
    }));
};