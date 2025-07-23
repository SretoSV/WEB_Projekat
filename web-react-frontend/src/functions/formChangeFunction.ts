export const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, formSetter: React.Dispatch<React.SetStateAction<any>>, x: string) => {
    const { name, value } = e.target;
    if(x === "string"){
        formSetter((prevForm: any) => ({
            ...prevForm,
            [name]: value,
        }));
    }
    else if(x === "number"){
        formSetter((prevForm: any) => ({
            ...prevForm,
            [name]: Number(value),
        }));
    }
};
