import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    searchInput: '',
    profileDetails: '',
    isProfileErr: false,
    isProfileLoading: true,
    activeTypeId: [],
    activeSalaryId: '',
    jobsList: [],
    isJobsLoading: true,
    isJobsErr: false,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  onclickProfileRetry = () => {
    this.setState(
      {profileDetails: '', isProfileErr: false, isProfileLoading: true},
      this.getProfileDetails,
    )
  }

  onclickRetry = () => {
    this.setState(
      {jobsList: [], isJobsLoading: true, isJobsErr: false},
      this.getJobs,
    )
  }

  getJobs = async () => {
    const {activeSalaryId, activeTypeId, searchInput} = this.state
    const types = activeTypeId.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${types}&minimum_package=${activeSalaryId}&search=${searchInput}`,
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = {jobs: data.jobs, total: data.total}
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(data)
      this.setState({
        isJobsLoading: false,
        isJobsErr: false,
        jobsList: updatedData,
      })
    } else {
      this.setState({isJobsErr: true, isJobsLoading: false})
    }
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        isProfileLoading: false,
        isProfileErr: false,
        profileDetails: updatedData,
      })
    } else {
      this.setState({isProfileErr: true, isProfileLoading: false})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    this.getJobs()
  }

  updateSalary = id => {
    this.setState({activeSalaryId: id}, this.getJobs)
  }

  updateType = id => {
    const {activeTypeId} = this.state
    const newList = [...activeTypeId, id]
    this.setState({activeTypeId: newList}, this.getJobs)
  }

  renderJobs = () => {
    const {jobsList, isJobsErr, isJobsLoading} = this.state
    if (isJobsLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    if (isJobsErr) {
      return (
        <div className="not-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="not-found-img"
          />
          <h1 className="home-heading">Oops! Something Went Wrong</h1>
          <p className="home-description">
            We cannot seem to find the page you are looking for
          </p>
          <button type="button" onClick={this.onclickRetry}>
            Retry
          </button>
        </div>
      )
    }
    if (jobsList.length === 0) {
      return (
        <div className="not-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="not-found-img"
          />
          <h1 className="home-heading">No Jobs Found</h1>
          <p className="home-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul className="jobs-list-container">
        {jobsList.map(each => (
          <Link to={`/jobs/${each.id}`} className="nav-link">
            <li key={each.id} className="job-details">
              <div className="top-details">
                <img
                  src={each.companyLogoUrl}
                  alt="company logo"
                  className="company-img"
                />
                <div className="top-right-details">
                  <h1 className="job-role">{each.title}</h1>
                  <div className="rating-container">
                    <button
                      type="button"
                      aria-label="Favorite"
                      className="rating-button"
                    >
                      <FaStar className="star-icon" />
                    </button>
                    <p className="rating-text">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="middle-details">
                <div className="middle-left-container">
                  <div className="ele-holder">
                    <p className="location-text">{each.location}</p>
                  </div>
                  <div className="ele-holder">
                    <p className="location-text">{each.employmentType}</p>
                  </div>
                </div>
                <p className="package-text">{each.packagePerAnnum}</p>
              </div>
              <h1 className="job-description">Description</h1>
              <p className="job-description-text">{each.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderProfile = () => {
    const {profileDetails, isProfileLoading, isProfileErr} = this.state
    const {name, shortBio, profileImageUrl} = profileDetails

    if (isProfileLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    if (isProfileErr) {
      return (
        <div>
          <button type="button" onClick={this.onclickProfileRetry}>
            Retry
          </button>
        </div>
      )
    }
    return (
      <div>
        <img src={profileImageUrl} alt={name} className="profile-img" />
        <h1 className="user-name">{name}</h1>
        <p className="user-description">{shortBio}</p>
      </div>
    )
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
        />
        <button
          data-testid="searchButton"
          className="rating-button"
          onClick={this.onEnterSearchInput}
          aria-label="searching"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-tyes-container">
            <div className="profile-container">{this.renderProfile()}</div>
            <div className="types-container">
              <h1 className="types-heading">Type of Employment</h1>
              <ul className="types-list">
                {employmentTypesList.map(each => (
                  <li
                    key={each.employmentTypeId}
                    className="type"
                    onClick={() => this.updateType(each.employmentTypeId)}
                  >
                    {each.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="salary-container">
              <h1 className="types-heading">Salary Range</h1>
              <ul className="salary-list">
                {salaryRangesList.map(each => (
                  <li
                    key={each.salaryRangeId}
                    className="salary"
                    onClick={() => this.updateSalary(each.salaryRangeId)}
                  >
                    {each.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-details-container">
            <div>{this.renderSearchInput()}</div>
            <div>{this.renderJobs()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
