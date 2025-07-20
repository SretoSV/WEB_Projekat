namespace KvizHub.DAO
{
    public interface ICRUDDao<T, ID>
    {
        int Count();

        int Delete(T entity);

        int DeleteAll();

        int DeleteById(ID id);

        bool ExistsById(ID id);

        IEnumerable<T> FindAll();

        IEnumerable<T> FindAllById(IEnumerable<ID> ids);

        T FindById(ID id);

        int Save(T entity);

        int SaveAll(IEnumerable<T> entities);

    }
}
