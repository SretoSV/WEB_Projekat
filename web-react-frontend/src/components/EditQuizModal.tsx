import styles from '../styles/AllQuizzesPagesStyles/EditQuizModalStyle.module.css';
import { useEffect, useState } from "react";
import { handleInputChange } from "../functions/formChangeFunction";
import ButtonWithText from './ButtonWithText';
import { useQuizContext } from '../context/QuizContext';
import type { QuizCategory } from '../models/QuizCategoryModel';
import type { Question } from '../models/QuestionModel';
import ButtonWithImage from './ButtonWithImage';
import plusImage from '../images/plus.png';
import CategoryCheckboxesCard from './CategoryCheckboxesCard';
import { createNewCategory, fetchCategories, toggleCategorySelection } from '../services/QuizCategoryService';
import { editQuiz } from '../services/QuizService';
import { QuestionsEditBox } from './QuestionsEditBox';
import { AddQuestion } from './AddQuestion';

interface EditQuizModalProps {
  show: boolean;
  onClose: () => void;
  quizId: number;
}

export default function EditQuizModal({ onClose, show, quizId }: EditQuizModalProps) {
  const { quizzes } = useQuizContext();
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return <div>Quiz not found</div>;
  
  const [allCategories, setAllCategories] = useState<Array<QuizCategory>>([]);
  const [selectedCategories, setSelectedCategories] = useState<QuizCategory[]>(quiz.categories);
  const [newCategory, setNewCategory] = useState<string>('');
  const [form, setForm] = useState({
    id: 0,
    title: '',
    description: '',
    numberOfQuestions: 0,
    difficulty: '',
    timeLimit: 0,
    categories: [] as QuizCategory[],
    questions: [] as Question[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
      const { categories } = await fetchCategories();
      setAllCategories(categories);
      } catch (err: any) {
        alert(err.message);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    setForm({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      numberOfQuestions: quiz.numberOfQuestions,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      categories: quiz.categories,
      questions: quiz.questions,
    });
  }, [quizId]);

  const handleToggleCategory = (category: QuizCategory) => {
    setSelectedCategories(prev => toggleCategorySelection(prev, category));
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };
      
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await editQuiz(quiz);
      onClose();
  };
        
  const handleAddCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newCategoryObject = createNewCategory(allCategories, selectedCategories, newCategory);

    if (!newCategoryObject) {
      alert("This Category already exists!");
      return;
    }

    setSelectedCategories([...selectedCategories, newCategoryObject]);
    setAllCategories([...allCategories, newCategoryObject]);
    setForm(prev => ({
      ...prev, 
      categories: [...prev.categories, newCategoryObject],
    }));
    setNewCategory("");
  };

  /*useEffect(()=> {
    console.log(form);
  },[form]);*/
      
  if (!show) return null;
  return (
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
        <div className={styles.formModal}>
            <label htmlFor="Title">Title:</label>
            <input 
                id="Title" 
                name="title"
                type="text" 
                value={form.title} 
                onChange={(e) => handleInputChange(e, setForm)}
                required
            />
            <br />
            <div className={styles.inputAndCheckboxDiv}>
              <div className={styles.categoryDiv}>
                <label htmlFor="Category" className={styles.categoryLabel}>Category:</label>
                <input 
                    id="Category" 
                    name="category"
                    type="text" 
                    placeholder='Type category...'
                    className={styles.categoryInput}
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <ButtonWithImage title="Add" widthImage="30px" heightImage='25px' onClick1={handleAddCategory} type="button" image={plusImage} alt={"plusImage"}/>
              </div>
              <CategoryCheckboxesCard 
                allCategories={allCategories || []}
                quizCategories={selectedCategories} 
                quizQuestions={quiz.questions}
                onCategoryToggle={handleToggleCategory}
              />
            </div>

            <br />
            <label htmlFor="Description">Description:</label>
            <br />
            <textarea 
              id="Description" 
              name="description"
              className={styles.descriptionInput} 
              placeholder="Description..." 
              value={form.description} 
              onChange={(e) => handleInputChange(e, setForm)} 
              required
            />
            <br />
            <br />
            <label htmlFor="Difficulty">Difficulty:</label>
            <select
              id="Difficulty"
              name="difficulty"
              className={styles.dropdownInput}
              value={form.difficulty}
              onChange={(e) => handleInputChange(e, setForm)}
              required
            >
              <option value="easy" >Easy</option>
              <option value="medium" >Medium</option>
              <option value="hard" >Hard</option>
            </select>

            <br />

            <label htmlFor="TimeLimit">Time limit(sec):</label>
            <input 
                id="TimeLimit" 
                type="number" 
                name="timeLimit"
                value={form.timeLimit} 
                onChange={(e) => handleInputChange(e, setForm)}
                required
            />
        </div>

        <QuestionsEditBox questions={quiz.questions} allCategories={allCategories || []}/>
        <AddQuestion />

        <div className={styles.buttonsDiv}>
            <ButtonWithText onClick1={handleCancel} type="button" text="Cancel" />
            <ButtonWithText onClick1={handleSubmit} type="button" text="Edit" />
        </div>

        </div>
    </div>
  );
}
