import { useCallback, useEffect, useState } from 'react';

import './style.css';

import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';


export const Home = () => {

  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [postsPerPage] = useState(8);
  const [searchValue, setSearchValue] = useState('');

  const noMorePosts = page + postsPerPage >= allPosts.length;
    //console.log({posts})

  const filteredPosts = !!searchValue ? 
  allPosts.filter(post => {
    return post.title.toLowerCase().includes(
      searchValue.toLowerCase()
    );
  }) 
  : posts;

  const handleLoadPosts = useCallback( async (page, postsPerPage) => {
    const postsAndPhotos = await loadPosts();
    
    setPosts(postsAndPhotos.slice(page, postsPerPage));
    setAllPosts(postsAndPhotos);

  }, []);

  useEffect(() => {
    // console.log('useEffect -> entrei')
    handleLoadPosts(0, postsPerPage);
  }, [handleLoadPosts, postsPerPage]);

  const loadMorePosts = () => {
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    setPosts(posts);
    setPage(nextPage);

    console.log( '\n Função -> loadMorePosts: ',  
      '\n\n page: ' + page,  
      '\n postsPerPage: ' + postsPerPage,
      '\n nextPage: ' + nextPage,
      '\n TotalPosts: ' +  (nextPage + postsPerPage) )
  }
  
  // imout search
    const handleChange = (e) => {
      const {value} = e.target;
      setSearchValue(value);
    } 

  return (
    <section className="container">
      <div className="search-container">
        {!!searchValue && (
          <h1>Search Value: {searchValue}</h1>
        )}
        <TextInput searchValue={searchValue} handleChange={handleChange}/>
      </div>

      {filteredPosts.length > 0 && (
        <Posts posts={filteredPosts} />
      )}
      {filteredPosts.length === 0 && (
        <p className="noSearch">Don't have pots whit the subjet: <b>{searchValue}</b></p>
      )}

      <div className="button-container">
        {!searchValue && (
          <Button
          text="Load More Posts"
          onClick={loadMorePosts}  // <== atributo, não é eveto
          disabled={noMorePosts}
          />
        )}
      </div>
    </section>
  );

}