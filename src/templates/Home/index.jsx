import { Component } from 'react';

import './style.css';

import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 2,
    searchValue: '',
  };

  async componentDidMount() { 
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;

    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    });
  }

  loadMorePosts = () => {
    // console.log('Load More posts CHAMADO')
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    this.setState({
      posts, 
      page: nextPage });

    console.log(
      '\n page: ' + page,  
      '\n postsPerPage: ' + postsPerPage,
      '\n nextPage: ' + nextPage,
      '\n TotalPosts: ' +  (nextPage + postsPerPage) )
  }

// imout search
  handleChange = (e) => {
    const {value} = e.target;
    this.setState({searchValue: value});
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;
    //console.log({posts})

    const filteredPosts = !!searchValue ? 
    allPosts.filter(post => {
      return post.title.toLowerCase().includes(
        searchValue.toLowerCase()
      );
    }) 
    : posts;;

      return (
        <section className="container">
          <div className="search-container">
            {!!searchValue && (
              <h1>Search Value: {searchValue}</h1>
            )}
            <TextInput searchValue={searchValue} handleChange={this.handleChange}/>
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
              onClick={this.loadMorePosts}  // <== atributo, não é eveto
              disabled={noMorePosts}
              />
            )}
          </div>
        </section>
      );
  }
}


