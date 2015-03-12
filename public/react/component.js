var PostBox = React.createClass({
  render: function() {
    return (
      <div className="PostBox">
        Hello, world! I am a PostBox.
      </div>
    );
  }
});
React.render(
  <PostBox />,
  document.getElementById('feed')
);
