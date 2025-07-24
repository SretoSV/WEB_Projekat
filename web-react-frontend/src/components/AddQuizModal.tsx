import styles from '../styles/AllQuizzesPagesStyles/AddAndEditQuizModalStyle.module.css';
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
import { QuestionsEditBox } from './QuestionsEditBox';
import { AddQuestion } from './AddQuestion';
import { EditQuestion } from './EditQuestion';
import type { Quiz } from '../models/QuizModel';
import ButtonWithLongText from './ButtonWithLongText';

interface EditQuizModalProps {
    onClose: () => void;
    onAddQuiz: (quiz: Quiz) => void;
}

export default function AddQuizModal({ onClose, onAddQuiz }: EditQuizModalProps) {
  const { quizzes } = useQuizContext();

  const [allCategories, setAllCategories] = useState<Array<QuizCategory>>([]);
  const [selectedCategories, setSelectedCategories] = useState<QuizCategory[]>([] as QuizCategory[]);
  const [selectedQuestion, setSelectedQuesion] = useState<Question>(
    {
      id: 0,
      text: "",
      questionTypeId: 0,
      quizCategoryId: 0,
      quizId: 0,
      answerOptions: []
    }
  );
  const [toggleQuestionsList, setToggleQuestionsList] = useState<boolean>(false);
  const [addNewQuestionState, setAddNewQuestionState] = useState<boolean>(false);
  const [editNewQuestionState, setEditNewQuestionState] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [form, setForm] = useState<Quiz>({
    id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1,
    title: '',
    description: '',
    numberOfQuestions: 0,
    difficulty: 'easy',
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

  const handleToggleCategory = (category: QuizCategory) => {
    setSelectedCategories(prev => toggleCategorySelection(prev, category));
    setForm(prev => ({ //setovane su kategorije ovde
      ...prev, 
      categories: [...prev.categories, category],
    }));
  };
  
  const handleToggleQuestionsList = () => {
    setToggleQuestionsList(current => !current);
  };

  const handleAddNewQuestionState = () => {
    setAddNewQuestionState(current => !current);
  };

  const handleEditNewQuestionState = () => {
    setEditNewQuestionState(current => !current);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };
      
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onAddQuiz(form);
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
    setForm(prev => ({ //setovane su kategorije ovde
      ...prev, 
      categories: [...prev.categories, newCategoryObject],
    }));
    setNewCategory("");
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuesion(question);
  }

  const handleEditQuestions = (question: Question) => {
    setForm(prevForm => ({
        ...prevForm,
        questions: prevForm.questions.map(q =>
            q.id === question.id ? question : q
        )
    }));
  }

  const handleAddQuestions = (question: Question) => {
    setForm(prevForm => ({
        ...prevForm, questions: [...prevForm.questions, question]
    }));
  }

  const handleDeleteQuestion = (question: Question) => {
    if(selectedQuestion.id === question.id){
      setEditNewQuestionState(false);
    }
    setForm(prevForm => ({
        ...prevForm, questions: prevForm.questions.filter(q => q.id !== question.id)
    }));
  }  

  return (
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formModal}>
              <label htmlFor="Title">Title:</label>
              <input 
                  id="Title" 
                  name="title"
                  type="text" 
                  value={form.title} 
                  onChange={(e) => handleInputChange(e, setForm, "string")}
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
                  quizQuestions={form.questions}
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
                onChange={(e) => handleInputChange(e, setForm, "string")} 
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
                onChange={(e) => handleInputChange(e, setForm, "string")}
                required
              >
                <option value="easy" >easy</option>
                <option value="medium" >medium</option>
                <option value="hard" >hard</option>
              </select>

              <br />

              <label htmlFor="TimeLimit">Time limit(sec):</label>
              <input 
                  id="TimeLimit" 
                  type="number" 
                  name="timeLimit"
                  value={form.timeLimit} 
                  onChange={(e) => handleInputChange(e, setForm, "number")}
                  required
              />
          </div>
          <div className={styles.toggleDiv}>
            <div className={styles.titleForQuestionsList}>Question List:</div>
            {
              selectedCategories.length !== 0 && 
              <>
                <ButtonWithText onClick={handleToggleQuestionsList} type="button" text="Toggle" />
                <ButtonWithLongText onClick={handleAddNewQuestionState} type="button" text="Add question" />
              </>
            }
          </div>
          <div className={styles.buttonsDiv}>
              <ButtonWithText onClick1={handleCancel} type="button" text="Cancel" />
              <ButtonWithText type="submit" text="Add quiz" />
          </div>
        </form>
        <br />
        {
          toggleQuestionsList &&
          <>
            <QuestionsEditBox 
              onDeleteQuestion={handleDeleteQuestion} 
              onEditNewQuestionState={handleEditNewQuestionState} 
              questions={form.questions} 
              selectedCategories={form.categories || []} 
              onSelectQuestion={handleSelectQuestion}
            />
            <div className={styles.addAndEditFields}>
              {
              addNewQuestionState && 
              <AddQuestion 
                quizId={selectedQuestion.quizId} 
                onAddNewQuestionState={handleAddNewQuestionState} 
                onAddQuestion={handleAddQuestions} 
                selectedCategories={selectedCategories} 
                questions={form.questions}
              />
              }
              {editNewQuestionState && 
              <EditQuestion omEditNewQuestionState={handleEditNewQuestionState} selectedCategories={selectedCategories} selectedQuestion={selectedQuestion} onEditQuestion={handleEditQuestions} />
              }
            </div>
          </>
        }

        </div>
    </div>
  );
}
