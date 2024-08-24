import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import LottieView from 'lottie-react-native';
import NoInternetAnimation from '../components/loading/animation2.json';
import homeData from '../JSON_DATA/HomeData';
import listData from '../JSON_DATA/ListData';
import approvalHistoryData from '../JSON_DATA/approvalHistoryData';
import returnToListData from '../JSON_DATA/returnToList';

const TOKEN =
  "uBylwJMQexOO6Wd3YSzQMspiZOSgyX3MV38nHDXtUmxu0MGESIEO26bblqwR1GrrFb3dZZuu6f7A66inioy1snV116crhfDo5gZ9TDP4nkTV0LgphjJMhB9rqcm4WcnZ";

const playNoInternetAnimation = () => {
  return new Promise((resolve, reject) => {
    let animationCompleted = false;

    const onAnimationComplete = () => {
      animationCompleted = true;
      resolve();
    };

    const animation = (
      <LottieView
        source={NoInternetAnimation}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
        onAnimationFinish={onAnimationComplete}
      />
    );

    // Display the animation
    // You can render this component wherever you need to display the animation

    // Wait until animation completes
    const checkAnimationCompletion = () => {
      if (animationCompleted) {
        // Animation completed, resolve the promise
        resolve();
      } else {
        // Animation not completed yet, check again after a short delay
        setTimeout(checkAnimationCompletion, 100);
      }
    };

    // Check animation completion
    checkAnimationCompletion();
  });
};

export class APICaller {

  async HomeData() {
     try {
         const EmpCode = await AsyncStorage.getItem("employeeCode");

         // Use the imported JSON data directly
         const data = homeData.find(item => item.HasPendingApprovals);

         // Simulate the structure as if it was fetched from an API
         const res = {
             json: async () => data
         };

         return res.json();
     } catch (error) {
         console.error("Error occurred during data fetching:", error);
         await playNoInternetAnimation();
         throw new Error("Error While fetching Data!!");
     }
  }

  async ListData(Category) {
    try {
        const EmpCode = await AsyncStorage.getItem("employeeCode");

        // Use the imported JSON data directly
        const data = listData.find(item =>
            item.Data.some(d => d.ApprovalCategory === Category)
        );

        // Filter the data based on the provided category
        const filteredData = {
            ...data,
            Data: data ? data.Data.filter(d => d.ApprovalCategory === Category) : []
        };

        // Simulate the structure as if it was fetched from an API
        const res = {
            json: async () => filteredData
        };

        return res.json();
    } catch (error) {
        console.error("Error occurred during data fetching:", error);
        await playNoInternetAnimation();
        throw new Error("Error While fetching Data!!");
    }
  }

  async TableData(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetDocumentDetails?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }

  async approvalHistory(DocumentNo, ApprovalCategory) {
    try {
        // Use static data instead of fetching from API
        const data = approvalHistoryData;

        // Check if data has been received
        if (data && data.Data) {
            // Filter the data based on DocumentNo and ApprovalCategory
            let filteredData = data.Data.filter(
                item => item.DocumentNo === DocumentNo && item.CategoryName === ApprovalCategory
            );

            // Further filter out entries with empty date and time and not approved
            filteredData = filteredData.filter(
                (item) => item.ApproverActionDate.trim() !== "" && item.ApproverDecisionStatus.trim() !== "PENDING"
            );

            // Custom sorting function
            filteredData.sort((a, b) => {
                // Parse dates
                const dateA = moment(a.ApproverActionDate, "DD-MM-YYYY HH:mm:ss");
                const dateB = moment(b.ApproverActionDate, "DD-MM-YYYY HH:mm:ss");

                // Compare dates
                if (dateA.isBefore(dateB)) return -1;
                if (dateB.isBefore(dateA)) return 1;
                return 0;
            });

            // Convert time format to AM/PM
            filteredData.forEach((item) => {
                item.ApproverActionDate = moment(
                    item.ApproverActionDate,
                    "DD-MM-YYYY HH:mm:ss"
                ).format("DD-MM-YYYY hh:mm A"); // AM/PM format
            });

            // Update the data with sorted and filtered array
            data.Data = filteredData;
        }

        return data;
    } catch (error) {
        console.error("Error occurred during data processing:", error);
        await playNoInternetAnimation(); // Make sure this function exists
        throw new Error("Error While processing Data!!");
    }
  }

  async returnToList(DocumentNo, ApprovalCategory) {
    try {
        // Simulate fetching data from the local file
        const data = returnToListData;

        // Return the data directly
        return data;
    } catch (error) {
        console.error("Error occurred during history fetching:", error);
        await playNoInternetAnimation();
        throw new Error("Error While fetching History!!");
    }
  }

  async postRemark({ data }) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/PostApproverDecision?ApprovalMapID=${data.ApprovalMapID}&Decision=${data.Decision}&Remarks=${data.Remarks}&ReturnToEmpcode=${data.ReturnToEmpcode}&Token=${TOKEN}`,
        { method: "POST" }
      );
      return res.json();
    } catch (error) {
      console.error("Error Uploading Data:", error);
      await playNoInternetAnimation();
      throw new Error("Error While Data Uploading!!");
    }
  }

  async GetAttachedFiles(DocumentNo, ApprovalCategory) {
    try {
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetAttachedFiles?DocumentNo=${DocumentNo}&ApprovalCategory=${ApprovalCategory}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error while fetching attached files");
    }
  }


  async GetImage() {
    try {
      const EmpCode = await AsyncStorage.getItem("employeeCode");
      const res = await fetch(
        `https://apps.sonalika.com:7007/WebServiceDev/api/SONE/GetUserProfilePic?EmpCode=${EmpCode}&Token=${TOKEN}`,
        { method: "GET" }
      );
      return res.json();
    } catch (error) {
      console.error("Error occurred during data fetching:", error);
      await playNoInternetAnimation();
      throw new Error("Error While fetching Data!!");
    }
  }
}

const apiCaller = new APICaller();
export default apiCaller;
