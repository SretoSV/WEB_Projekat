import { useEffect, useState } from 'react';
import { QuizCard } from './QuizCard';
import { useQuizContext } from '../context/QuizContext';
import { addQuiz } from '../services/QuizService';
import styles from "../styles/AllQuizzesPagesStyles/QuizSectionStyle.module.css";
import ButtonWithLongText from './ButtonWithLongText';
import type { Quiz } from '../models/QuizModel';
import AddQuizModal from './AddQuizModal';
import { useUserContext } from '../context/UserContext';
import { filterForQuizzesDropDown, filterForQuizzesSearch } from '../functions/searchFunction';
import type { QuizCategory } from '../models/QuizCategoryModel';
import { fetchCategories } from '../services/QuizCategoryService';

export function QuizzesSection() {
  const { user } = useUserContext();
  const { quizzes, setQuizzes } = useQuizContext();
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allCategories, setAllCategories] = useState<Array<QuizCategory>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    if(user && user.isAdmin){
      const fetchData = async () => {
        try {
        const { categories } = await fetchCategories();
        setAllCategories(categories);
        } catch (err: any) {
          alert(err.message);
        }
      };
      fetchData();
    }
  }, []);

  const handleAddQuiz = async (quiz: Quiz) => {
    if(quiz.allQuizCategories.length !== 0) {
      try {
        const { addedQuiz } = await addQuiz(quiz);
        setQuizzes([...quizzes, addedQuiz]);
        setShowAddQuizModal(false);
      } catch (err: any) {
        alert(err.message);
      }
    }
    else{
      alert("A quiz needs to have at least one category.");
    }
  }

  const step1filteredQuizzes: Quiz[] = filterForQuizzesSearch(quizzes, searchTerm);
  const step2filteredQuizzes: Quiz[] = filterForQuizzesDropDown(step1filteredQuizzes, selectedCategory, "category");
  const step3filteredQuizzes: Quiz[] = filterForQuizzesDropDown(step2filteredQuizzes, selectedDifficulty, "difficulty");

  return (
    <>
        <div className={styles.divTop}>
          <h1 className={styles.title}>Quizzes</h1>
          {user && user.isAdmin &&
            <div className={styles.addQuizButtonDiv}>
              <ButtonWithLongText text='Add quiz' onClick={() => setShowAddQuizModal(true)}/>
            </div>
          }
          {showAddQuizModal &&
            <AddQuizModal onAddQuiz={handleAddQuiz} onClose={() => setShowAddQuizModal(false)}/>
          }
        </div>
        <div className={styles.filtersDiv}>
          <input
              id="search"
              type="text"
              placeholder="Pretraži..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBox}
          />
          <select
            id="category"
            name="category"
            className={styles.dropdownInput}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>

          <select
            id="difficulty"
            name="difficulty"
            className={styles.dropdownInput}
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option> 
          </select>
        </div>

        {step3filteredQuizzes.map(quiz => (
            <QuizCard key={quiz.id} quizId={quiz.id} />
        ))}
    </>
  );
}