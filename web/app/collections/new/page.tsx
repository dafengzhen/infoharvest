'use client';

export default function CreateCollection() {
  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Collection</h2>
          <p>create a new collection</p>
          <div className="divider"></div>
          <div>
            <div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered w-full max-w-xs"
                />
                <label className="label">
                  <span className="label-text-alt">Bottom Left label</span>
                </label>
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-info">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
