export default function WebApi(props) {
  return fetch('https://api.github.com/repos/tannerlinsley/react-query').then(
    res => res.json()
  );
}
