import PropTypes from 'prop-types';
import Post from './Post';

export default function PostList(props) {
    return (
        <div style={{ marginTop: '24px' }}>
            {props.posts.map((item, index) => {
                return (
                    <Post
                        post={item}
                        key={index}
                        onRemove={props.removeUpdate}
                    />
                );
            })}
        </div>
    );
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired,
};
