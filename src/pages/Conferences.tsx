import ConferenceList from "../components/ConferenceList";
import ConferenceForm from "../components/ConferenceForm";

const ConferencesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Conference Management System</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConferenceList />
        </div>
        <div>
          <ConferenceForm />
        </div>
      </div>
    </div>
  );
};

export default ConferencesPage;
