import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "../../apis/Hospital";
import ProviderCard from "../../components/ProviderCard/ProviderCard";
import ReactPaginate from "react-paginate";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 6; // Number of items per page

const ViewProviders = () => {
  const {
    data: providers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [category, setCategory] = useState("");

  // Paginated data
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentPageProviders = providers?.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const displayProviders = useMemo(() => {
    if (!category) return providers;
    return providers?.filter((provider) =>
      provider.specialization.toLowerCase().includes(category.toLowerCase())
    );
  }, [providers, category]);
  if (isLoading) return <div>Loading providers...</div>;
  if (error) return <div>Error fetching providers.</div>;
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="relative w-full mb-4 md:w-1/2">
        <input
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
          type="text"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(0); // Reset to the first page on search
          }}
          placeholder="Search Providers by Specialization"
        />
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 cursor-pointer"
          title="Search by specialization, e.g., 'cardiology'"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProviders?.map((provider) => (
          <ProviderCard key={provider.provider_id} provider={provider} />
        ))}
      </div>

      {/* Pagination Component */}
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(displayProviders.length / ITEMS_PER_PAGE)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"flex items-center gap-2"}
          activeClassName={"bg-blue-500 text-white rounded px-2"}
          pageClassName={"px-2 py-1 border rounded"}
          previousClassName={"px-3 py-1 border rounded bg-gray-200"}
          nextClassName={"px-3 py-1 border rounded bg-gray-200"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>
  );
};

export default ViewProviders;
