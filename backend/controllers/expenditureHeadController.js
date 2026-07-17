const expenditureHeads = [
  {
    id: 1,
    name: "Self"
  },
  {
    id: 2,
    name: "Institute Fund"
  },
  {
    id: 3,
    name: "Project Fund"
  }
];

exports.getExpenditureHeads = (req, res) => {
  res.json(expenditureHeads);
};