const styles = {
  Card: {
    top: "160px",
    left: "20px",
    width: "335px",
    height: "42px",
    backgroundColor: "#f0f0f0",
    borderRadius: "24px",
  },
};

const Card = (props: any) => {
  return <div style={styles.Card}>{props.children}</div>;
};

export default Card;
