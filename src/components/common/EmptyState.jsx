const EmptyState = ({ icon = '📭', title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;