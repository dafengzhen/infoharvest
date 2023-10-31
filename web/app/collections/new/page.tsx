'use client';

export default function CreateCollection() {
  return (
    <div className="px-2 py-4 mx-auto">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <h2 className="card-title">Collection</h2>
          <p>create a new collection</p>
          <div className="divider"></div>
          <div>
            <div className="form-control my-3">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">
                  Please enter the name of the collection
                </span>
              </label>
            </div>
          </div>
          <div className="card-actions mt-4">
            <button className="btn btn-outline btn-success normal-case">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
