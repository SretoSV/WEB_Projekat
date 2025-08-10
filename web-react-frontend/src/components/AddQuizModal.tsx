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
import { createNewCategory, deleteCategory, fetchCategories } from '../services/QuizCategoryService';
import { QuestionsEditBox } from './QuestionsEditBox';
import { AddQuestion } from './AddQuestion';
import { EditQuestion } from './EditQuestion';
import type { Quiz } from '../models/QuizModel';
import ButtonWithLongText from './ButtonWithLongText';
import type { UserQuizResult } from '../models/UserQuizResultModel';
import { useUserContext } from '../context/UserContext';

interface EditQuizModalProps {
    onClose: () => void;
    onAddQuiz: (quiz: Quiz) => void;
}

export default function AddQuizModal({ onClose, onAddQuiz }: EditQuizModalProps) {
  const { handleLogout } = useUserContext();
  const { quizzes } = useQuizContext();

  const [allCategories, setAllCategories] = useState<Array<QuizCategory>>([]);
  const [selectedCategories, setSelectedCategories] = useState<QuizCategory[]>([] as QuizCategory[]);
  const [selectedQuestion, setSelectedQuesion] = useState<Question>(
    {
      id: 0,
      text: "",
      questionTypeId: 0,
      quizCategoryId: 0,
      questionDifficultyId: 1,
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
    quizDifficultyId: 1,
    timeLimitSeconds: 0,
    allQuizCategories: [] as QuizCategory[],
    questions: [] as Question[],
    results: [] as UserQuizResult[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
      const { categories } = await fetchCategories(handleLogout);
      setAllCategories(categories);
      } catch (err: any) {
        throw new Error(err);
      }
    };
    fetchData();
  }, []);

  const handleToggleCategory = (category: QuizCategory, checked: boolean) => {
    const updatedCategory = { ...category, isUsed: checked };

    setSelectedCategories(prev => 
      checked
        ? [...prev, updatedCategory]
        : prev.filter(c => c.id !== category.id)
    );

    setForm(prev => ({
      ...prev,
      allQuizCategories: checked
        ? [...prev.allQuizCategories, updatedCategory]
        : prev.allQuizCategories.filter(c => c.id !== category.id),
    }));

    setAllCategories(prev =>
      prev.map(c => c.id === category.id ? { ...c, isUsed: checked } : c)
    );
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
  };
        
  const handleAddCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if(newCategory !== ""){
      const newCategoryObject = createNewCategory(allCategories, selectedCategories, newCategory);

      if (!newCategoryObject) {
        alert("This Category already exists!");
        return;
      }

      setSelectedCategories([...selectedCategories, newCategoryObject]);
      setAllCategories([...allCategories, newCategoryObject]);
      setForm(prev => ({ //setovane su kategorije ovde
        ...prev, 
        allQuizCategories: [...prev.allQuizCategories, newCategoryObject],
      }));
      setNewCategory("");
    }
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

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm(`Are you sure you want to delete this category?`)){
      try {
          const { deletedCategoryId } = await deleteCategory(categoryId, handleLogout);
          setAllCategories(allCategories.filter(c => c.id !== deletedCategoryId));

          const isSelected = form.allQuizCategories.some(c => c.id === categoryId);
          if (isSelected) return;
          setAllCategories(prev => prev.filter(c => c.id !== categoryId));

      } catch (err: any) {
          throw new Error(err);
      }
    }
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
                  onDeleteCategory={handleDeleteCategory}
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
              <label htmlFor="QuizDifficultyId">Difficulty:</label>
              <select
                id="QuizDifficultyId"
                name="quizDifficultyId"
                className={styles.dropdownInput}
                value={form.quizDifficultyId}
                onChange={(e) => handleInputChange(e, setForm, "number")}
                required
              >
                <option value={1} >easy</option>
                <option value={2} >medium</option>
                <option value={3} >hard</option>
              </select>

              <br />

              <label htmlFor="TimeLimitSeconds">Time limit(sec):</label>
              <input 
                  id="TimeLimitSeconds" 
                  type="number" 
                  name="timeLimitSeconds"
                  value={form.timeLimitSeconds} 
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
              selectedCategories={form.allQuizCategories || []} 
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
              <EditQuestion 
                onEditNewQuestionState={handleEditNewQuestionState} 
                selectedCategories={selectedCategories} 
                selectedQuestion={selectedQuestion} 
                onEditQuestion={handleEditQuestions} 
                questions={form.questions}                
                />
              }
            </div>
          </>
        }

        </div>
    </div>
  );
}
